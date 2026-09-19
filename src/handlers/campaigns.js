import { TIER_CONFIG } from "../config/tiers.js";
import { getTeam } from "./teams.js";
import { listAllLinks } from "../kv/links.js";
import { getAuthenticatedUser } from "../utils/auth.js";
import { json } from "../utils/http.js";

// Campaigns (Plus+): list + history.

export async function handleListCampaigns(request, env, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return json({ success: false, error: "Unauthorized" }, 401, corsHeaders);
  const limits = TIER_CONFIG[authedUser.role] || {};
  if (!limits.hasCampaignHistory) return json({ success: false, error: "Campaign history yêu cầu gói Plus trở lên" }, 403, corsHeaders);
  const allLinks = await listAllLinks(env);
  let userLinks;
  if (authedUser.role === "admin") { userLinks = allLinks; } else {
    let ownerSet = new Set([authedUser.username.toLowerCase()]);
    if (authedUser.teamId) { const team = await getTeam(env, authedUser.teamId); if (team && team.members) team.members.forEach(function(m){ ownerSet.add(m.username.toLowerCase()); }); }
    userLinks = allLinks.filter(l => ownerSet.has((l.owner || "").toLowerCase()));
  }
  const campaignMap = {};
  for (const link of userLinks) {
    if (!link.campaign) continue;
    if (!campaignMap[link.campaign]) campaignMap[link.campaign] = { name: link.campaign, linkCount: 0, totalClicks: 0 };
    campaignMap[link.campaign].linkCount++;
    campaignMap[link.campaign].totalClicks += (link.totalClicks || 0);
  }
  const campaigns = Object.values(campaignMap).sort((a, b) => b.linkCount - a.linkCount);
  return json({ success: true, count: campaigns.length, campaigns }, 200, corsHeaders);
}

export async function handleCampaignHistory(request, env, campaignName, corsHeaders) {
  const authedUser = await getAuthenticatedUser(request, env);
  if (!authedUser) return json({ success: false, error: "Unauthorized" }, 401, corsHeaders);
  const limits = TIER_CONFIG[authedUser.role] || {};
  if (!limits.hasCampaignHistory) return json({ success: false, error: "Campaign history yêu cầu gói Plus trở lên" }, 403, corsHeaders);
  const allLinks = await listAllLinks(env);
  let userLinks;
  if (authedUser.role === "admin") { userLinks = allLinks; } else {
    let ownerSet = new Set([authedUser.username.toLowerCase()]);
    if (authedUser.teamId) { const team = await getTeam(env, authedUser.teamId); if (team && team.members) team.members.forEach(function(m){ ownerSet.add(m.username.toLowerCase()); }); }
    userLinks = allLinks.filter(l => ownerSet.has((l.owner || "").toLowerCase()));
  }
  const matchingLinks = userLinks.filter(l => {
    if (l.campaign === campaignName) return true;
    if (l.campaignHistory && l.campaignHistory.some(h => h.campaign === campaignName)) return true;
    return false;
  });
  const links = matchingLinks.map(l => ({ code: l.code, url: l.url, shortUrl: l.shortUrl || "", campaign: l.campaign, totalClicks: l.totalClicks || 0, campaignHistory: l.campaignHistory || [] }));
  return json({ success: true, campaign: campaignName, count: links.length, links }, 200, corsHeaders);
}
