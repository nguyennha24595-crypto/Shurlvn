// KV: domain/keyword blacklist + one-time sample-data seeding.

import { DEFAULT_KEYWORDS, DEFAULT_BLACKLIST_DOMAINS } from "../config/constants.js";
import { randomHex, hashPassword } from "../utils/crypto.js";
import { putUser } from "./users.js";
import { putLink } from "./links.js";

export async function getBlacklistRaw(env) {
  const raw = await env.LINKS_KV.get("blacklist");
  if (raw) return JSON.parse(raw);
  return { domains: [...DEFAULT_BLACKLIST_DOMAINS], keywords: [] };
}

export async function putBlacklistRaw(env, data) {
  await env.LINKS_KV.put("blacklist", JSON.stringify(data));
}

export async function seedIfNeeded(env) {
  const flag = await env.LINKS_KV.get("seed:v2");
  if (flag) return;

  const now = Date.now();

  const adminSalt = randomHex(16);
  const adminUser = {
    id: "usr_admin", username: "admin", email: "admin@shurl.dev", role: "admin",
    apiToken: "shurl_live_" + randomHex(16),
    createdAt: new Date(now).toISOString(),
    salt: adminSalt, hash: await hashPassword("hubaba123", adminSalt)
  };

  const proSalt = randomHex(16);
  const proUser = {
    id: "usr_pro", username: "pro_marketer", email: "pro@business.com", role: "pro",
    apiToken: "shurl_live_" + randomHex(16),
    createdAt: new Date(now - 7 * 86400000).toISOString(),
    salt: proSalt, hash: await hashPassword("pro123456", proSalt)
  };

    const superSalt = randomHex(16);
  const superUser = {
    id: "usr_super", username: "enterprise_corp", email: "super@enterprise.com", role: "super",
    apiToken: "shurl_live_" + randomHex(16),
    createdAt: new Date(now - 14 * 86400000).toISOString(),
    salt: superSalt, hash: await hashPassword("super123456", superSalt)
  };

await Promise.all([putUser(env, adminUser), putUser(env, proUser), putUser(env, superUser)]);
  await env.LINKS_KV.put("apitoken:" + adminUser.apiToken, adminUser.username.toLowerCase());
  await env.LINKS_KV.put("apitoken:" + proUser.apiToken, proUser.username.toLowerCase());
  await env.LINKS_KV.put("apitoken:" + superUser.apiToken, superUser.username.toLowerCase());

  const sampleLinks = [
    {
      code: "baogia", url: "https://ABCDEFGH.com/vn/bao-gia-may-2026",
      owner: "pro_marketer", role: "pro", createdAt: new Date(now - 48 * 3600000).toISOString(),
      title: "Bảng Báo Giá Máy In", campaign: "Q1-Marketing",
      tags: ["pricing", "b2b", "leibinger"], isEnabled: true, expiryDate: null,
      totalClicks: 148, destinationHistory: []
    },
    {
      code: "catalogue", url: "https://catalog.example.vn/products-showcase-2026.pdf",
      owner: "enterprise_corp", role: "super", createdAt: new Date(now - 72 * 3600000).toISOString(),
      title: "Catalogue Tổng Hợp Sản Phẩm 2026", campaign: "Spring-Campaign",
      tags: ["catalogue", "pdf", "sales"], isEnabled: true, expiryDate: null,
      totalClicks: 620, destinationHistory: []
    },
    {
      code: "zalo-cskh", url: "https://zalo.me/0987654321",
      owner: "pro_marketer", role: "pro", createdAt: new Date(now - 96 * 3600000).toISOString(),
      title: "Kênh Zalo Chăm Sóc Khách Hàng VIP", campaign: "Support-Direct",
      tags: ["support", "zalo"], isEnabled: true, expiryDate: null,
      totalClicks: 215, destinationHistory: []
    },
    {
      code: "intro26", url: "https://github.com",
      owner: "admin", role: "admin", createdAt: new Date(now - 120 * 3600000).toISOString(),
      title: "GitHub Developer Hub", campaign: "Dev",
      tags: ["dev", "github"], isEnabled: true, expiryDate: null,
      totalClicks: 89, destinationHistory: []
    }
  ];
  await Promise.all(sampleLinks.map(l => putLink(env, l)));

  await putBlacklistRaw(env, { domains: [...DEFAULT_BLACKLIST_DOMAINS], keywords: [] });
  await env.LINKS_KV.put("seed:v2", "1");
}

export async function isDomainBlacklisted(env, targetUrl) {
  try {
    const hostname = new URL(targetUrl).hostname.toLowerCase();
    const bl = await getBlacklistRaw(env);
    return bl.domains.some(d => hostname === d || hostname.endsWith("." + d));
  } catch (e) {
    return true;
  }
}

export async function isKeywordBlacklisted(env, code, role) {
  if (role === "admin") return false;
  const bl = await getBlacklistRaw(env);
  const all = [...DEFAULT_KEYWORDS, ...bl.keywords];
  const lower = code.toLowerCase();
  return all.some(kw => lower.includes(kw.toLowerCase()));
}
