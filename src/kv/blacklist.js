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

  // Mật khẩu KHÔNG được ghi cứng trong code (từng lộ trong lịch sử git) — chỉ tạo tài khoản admin
  // mẫu khi có Worker secret SEED_ADMIN_PASSWORD (wrangler secret put SEED_ADMIN_PASSWORD). Không có
  // secret thì bỏ qua bước tạo user, môi trường mới sẽ tự đăng ký admin rồi nâng role trong KV.
  if (env.SEED_ADMIN_PASSWORD) {
    const adminSalt = randomHex(16);
    const adminUser = {
      id: "usr_admin", username: "admin", email: env.SEED_ADMIN_EMAIL || "admin@shurl.dev", role: "admin",
      apiToken: "shurl_live_" + randomHex(16),
      createdAt: new Date(now).toISOString(),
      salt: adminSalt, hash: await hashPassword(env.SEED_ADMIN_PASSWORD, adminSalt)
    };
    await putUser(env, adminUser);
    await env.LINKS_KV.put("apitoken:" + adminUser.apiToken, adminUser.username.toLowerCase());
    await putLink(env, {
      code: "intro26", url: "https://github.com",
      owner: "admin", role: "admin", createdAt: new Date(now - 120 * 3600000).toISOString(),
      title: "GitHub Developer Hub", campaign: "Dev",
      tags: ["dev", "github"], isEnabled: true, expiryDate: null,
      totalClicks: 89, destinationHistory: []
    });
  }

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
