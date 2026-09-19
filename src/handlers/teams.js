import { TIER_CONFIG } from "../config/tiers.js";
import { st } from "../i18n/server.js";
import { getUser, putUser } from "../kv/users.js";
import { getAuthenticatedUser } from "../utils/auth.js";
import { randomHex } from "../utils/crypto.js";
import { json } from "../utils/http.js";

// Teams (Super/Admin): CRUD + membership.

export async function getTeam(env, teamId) {
  if (!teamId) return null;
  const raw = await env.LINKS_KV.get("team:" + teamId);
  return raw ? JSON.parse(raw) : null;
}

export async function putTeam(env, team) {
  await env.LINKS_KV.put("team:" + team.id, JSON.stringify(team));
}

export async function listAllTeams(env) {
  const teams = [];
  let cursor;
  do {
    const page = await env.LINKS_KV.list({ prefix: "team:", cursor });
    const pageTeams = await Promise.all(page.keys.map(k => env.LINKS_KV.get(k.name)));
    for (const raw of pageTeams) { if (raw) teams.push(JSON.parse(raw)); }
    cursor = page.cursor;
    if (page.list_complete) break;
  } while (cursor);
  return teams;
}

export async function isUserInSameTeam(env, username1, username2) {
  if (!username1 || !username2 || username1.toLowerCase() === username2.toLowerCase()) return true;
  const user1 = await getUser(env, username1);
  if (!user1 || !user1.teamId) return false;
  const team = await getTeam(env, user1.teamId);
  if (!team || !team.members) return false;
  return team.members.some(m => m.username.toLowerCase() === username2.toLowerCase());
}

export async function handleCreateTeam(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return json({ success: false, error: "Unauthorized" }, 401, corsHeaders);
  const limits = TIER_CONFIG[authedUser.role] || {};
  if (!limits.hasTeam) return json({ success: false, error: st("team_requires_super", request) }, 403, corsHeaders);

  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { name } = body || {};
  if (!name || !name.trim()) return json({ success: false, error: st("team_name_required", request) }, 400, corsHeaders);

  const teamId = "team_" + randomHex(8);
  const team = {
    id: teamId,
    name: name.trim(),
    ownerId: authedUser.id,
    members: [{ username: authedUser.username, role: "owner", addedAt: new Date().toISOString() }],
    createdAt: new Date().toISOString()
  };
  await putTeam(env, team);

  // authedUser is the sanitized (no salt/hash) copy from getAuthenticatedUser() — persisting
  // it directly would silently wipe the user's password. Fetch the full record to save instead.
  const fullUser = await getUser(env, authedUser.username);
  if (fullUser) {
    fullUser.teamId = teamId;
    await putUser(env, fullUser);
  }

  return json({ success: true, team }, 201, corsHeaders);
}

export async function handleListTeams(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return json({ success: false, error: "Unauthorized" }, 401, corsHeaders);
  const limits = TIER_CONFIG[authedUser.role] || {};
  if (!limits.hasTeam) return json({ success: false, error: "Team yêu cầu gói Super" }, 403, corsHeaders);
  
  const allTeams = await listAllTeams(env);
  const userTeams = allTeams.filter(t => t.members && t.members.some(m => m.username.toLowerCase() === authedUser.username.toLowerCase()));
  return json({ success: true, count: userTeams.length, teams: userTeams }, 200, corsHeaders);
}

export async function handleDeleteTeam(request, env, teamId, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return json({ success: false, error: "Unauthorized" }, 401, corsHeaders);
  const limits = TIER_CONFIG[authedUser.role] || {};
  if (!limits.hasTeam) return json({ success: false, error: st("team_requires_super", request) }, 403, corsHeaders);

  const team = await getTeam(env, teamId);
  if (!team) return json({ success: false, error: st("team_not_found", request) }, 404, corsHeaders);
  if (team.ownerId !== authedUser.id && authedUser.role !== "admin") return json({ success: false, error: st("team_only_owner_delete", request) }, 403, corsHeaders);

  for (const m of (team.members || [])) {
    const mu = await getUser(env, m.username);
    if (mu && mu.teamId === teamId) { mu.teamId = null; await putUser(env, mu); }
  }
  await env.LINKS_KV.delete("team:" + teamId);
  return json({ success: true, message: st("team_deleted", request) }, 200, corsHeaders);
}

export async function handleUpdateTeam(request, env, teamId, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return json({ success: false, error: "Unauthorized" }, 401, corsHeaders);
  const limits = TIER_CONFIG[authedUser.role] || {};
  if (!limits.hasTeam) return json({ success: false, error: st("team_requires_super", request) }, 403, corsHeaders);

  const team = await getTeam(env, teamId);
  if (!team) return json({ success: false, error: st("team_not_found", request) }, 404, corsHeaders);
  if (team.ownerId !== authedUser.id && authedUser.role !== "admin") return json({ success: false, error: st("team_only_owner_edit", request) }, 403, corsHeaders);
  
  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { name } = body || {};
  if (name && name.trim()) team.name = name.trim();
  await putTeam(env, team);
  return json({ success: true, team }, 200, corsHeaders);
}

export async function handleAddTeamMember(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return json({ success: false, error: "Unauthorized" }, 401, corsHeaders);
  const limits = TIER_CONFIG[authedUser.role] || {};
  if (!limits.hasTeam) return json({ success: false, error: st("team_requires_super", request) }, 403, corsHeaders);

  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { teamId, username } = body || {};
  if (!teamId || !username) return json({ success: false, error: st("team_missing_id_or_username", request) }, 400, corsHeaders);

  const team = await getTeam(env, teamId);
  if (!team) return json({ success: false, error: st("team_not_found", request) }, 404, corsHeaders);
  if (team.ownerId !== authedUser.id && authedUser.role !== "admin") return json({ success: false, error: st("team_only_owner_add_member", request) }, 403, corsHeaders);

  const maxMembers = limits.maxTeamMembers || 10;
  if (team.members.length >= maxMembers) return json({ success: false, error: st("team_max_members", request).replace("{count}", maxMembers) }, 400, corsHeaders);

  const cleanUsername = username.trim().toLowerCase();
  const targetUser = await getUser(env, cleanUsername);
  if (!targetUser) return json({ success: false, error: st("team_user_not_found", request) }, 404, corsHeaders);
  if (targetUser.teamId) return json({ success: false, error: st("team_user_in_other_team", request) }, 400, corsHeaders);
  if (team.members.some(m => m.username.toLowerCase() === cleanUsername)) return json({ success: false, error: st("team_already_member", request) }, 400, corsHeaders);
  
  team.members.push({ username: targetUser.username, role: "member", addedAt: new Date().toISOString() });
  await putTeam(env, team);
  
  targetUser.teamId = teamId;
  await putUser(env, targetUser);
  
  return json({ success: true, member: { username: targetUser.username, role: "member" } }, 201, corsHeaders);
}

export async function handleRemoveTeamMember(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return json({ success: false, error: "Unauthorized" }, 401, corsHeaders);
  const limits = TIER_CONFIG[authedUser.role] || {};
  if (!limits.hasTeam) return json({ success: false, error: st("team_requires_super", request) }, 403, corsHeaders);

  let body;
  try { body = await request.json(); } catch (e) { body = {}; }
  const { teamId, username } = body || {};
  if (!teamId || !username) return json({ success: false, error: st("team_missing_id_or_username", request) }, 400, corsHeaders);

  const team = await getTeam(env, teamId);
  if (!team) return json({ success: false, error: st("team_not_found", request) }, 404, corsHeaders);
  if (team.ownerId !== authedUser.id && authedUser.role !== "admin") return json({ success: false, error: st("team_only_owner_remove_member", request) }, 403, corsHeaders);

  const cleanUsername = username.trim().toLowerCase();
  const member = team.members.find(m => m.username.toLowerCase() === cleanUsername);
  if (!member) return json({ success: false, error: st("team_member_not_found", request) }, 404, corsHeaders);
  if (member.role === "owner") return json({ success: false, error: st("team_cannot_remove_owner", request) }, 400, corsHeaders);
  
  team.members = team.members.filter(m => m.username.toLowerCase() !== cleanUsername);
  await putTeam(env, team);
  
  const targetUser = await getUser(env, cleanUsername);
  if (targetUser && targetUser.teamId === teamId) { targetUser.teamId = null; await putUser(env, targetUser); }
  
  return json({ success: true, message: "Đã xóa thành viên" }, 200, corsHeaders);
}
