import { TIER_CONFIG } from "../config/tiers.js";
import { getTeam } from "./teams.js";
import { listAllLinks } from "../kv/links.js";
import { getAuthenticatedUser } from "../utils/auth.js";
import { json } from "../utils/http.js";

// Data export (Pro/Super): CSV/JSON.

export async function handleExportCsv(request, env, url, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return json({ success: false, error: "Unauthorized" }, 401, corsHeaders);
  const limits = TIER_CONFIG[authedUser.role] || {};
  if (!limits.hasDataExport) return json({ success: false, error: "Data export requires Pro or Super plan" }, 403, corsHeaders);

  const allLinks = await listAllLinks(env);
  let userLinks; if (authedUser.role === "admin") { userLinks = allLinks; } else { let ownerSet = new Set([authedUser.username.toLowerCase()]); if (authedUser.teamId) { const team = await getTeam(env, authedUser.teamId); if (team && team.members) { team.members.forEach(function(m){ ownerSet.add(m.username.toLowerCase()); }); } } userLinks = allLinks.filter(l => ownerSet.has((l.owner || "").toLowerCase())); }
  const campaignFilter = url.searchParams.get("campaign");
  if (campaignFilter) userLinks = userLinks.filter(l => (l.campaign || "") === campaignFilter);
  const origin = new URL(request.url).origin;

  const headers = ["code", "short_url", "destination", "title", "campaign", "tags", "total_clicks", "is_enabled", "created_at", "expires_at", "is_deleted"];
  const rows = userLinks.map(l => [
    l.code, origin + "/" + l.code, l.url, (l.title || ""), (l.campaign || ""), (l.tags || []).join("|"),
    (l.totalClicks || 0), (l.isEnabled !== false), (l.createdAt || ""), (l.expiryDate || ""), (l.isDeleted || false)
  ]);
  
  const csv = [headers.join(","), ...rows.map(r => r.map(c => {
    const s = String(c);
    return s.includes(",") || s.includes('"') ? '"' + s.replace(/"/g, '""') + '"' : s;
  }).join(","))].join("\n");
  
  return new Response(csv, {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=\"shurl-export.csv\""
    }
  });
}

export async function handleExportJson(request, env, url, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return json({ success: false, error: "Unauthorized" }, 401, corsHeaders);
  const limits = TIER_CONFIG[authedUser.role] || {};
  if (!limits.hasDataExport) return json({ success: false, error: "Data export requires Pro or Super plan" }, 403, corsHeaders);

  const allLinks = await listAllLinks(env);
  let userLinks; if (authedUser.role === "admin") { userLinks = allLinks; } else { let ownerSet = new Set([authedUser.username.toLowerCase()]); if (authedUser.teamId) { const team = await getTeam(env, authedUser.teamId); if (team && team.members) { team.members.forEach(function(m){ ownerSet.add(m.username.toLowerCase()); }); } } userLinks = allLinks.filter(l => ownerSet.has((l.owner || "").toLowerCase())); }
  const campaignFilter = url.searchParams.get("campaign");
  if (campaignFilter) userLinks = userLinks.filter(l => (l.campaign || "") === campaignFilter);

  const exportData = {
    exported_at: new Date().toISOString(),
    exported_by: authedUser.username,
    total_links: userLinks.length,
    links: userLinks.map(l => ({
      code: l.code,
      destination: l.url,
      title: l.title || "",
      total_clicks: l.totalClicks || 0,
      is_enabled: l.isEnabled !== false,
      created_at: l.createdAt,
      expires_at: l.expiryDate || null,
      is_deleted: l.isDeleted || false,
      campaign: l.campaign || null,
      tags: l.tags || []
    }))
  };
  
  return new Response(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": "attachment; filename=\"shurl-export.json\""
    }
  });
}
