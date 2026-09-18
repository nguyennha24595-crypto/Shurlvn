// Tier-override resolution and daily/monthly quota checks (links, API calls, dynamic QR).

import { TIER_CONFIG } from "../config/tiers.js";
import { todayStr, thisMonthStr } from "./http.js";
import { getUser, putUser } from "../kv/users.js";

export async function getTierOverrides(env) {
  if (env._tierOverridesCache && env._tierOverridesCacheTime && (Date.now() - env._tierOverridesCacheTime < 30000)) {
    return env._tierOverridesCache;
  }
  const raw = await env.LINKS_KV.get("sys:settings");
  const overrides = (raw && JSON.parse(raw).tierOverrides) || {};
  env._tierOverridesCache = overrides;
  env._tierOverridesCacheTime = Date.now();
  return overrides;
}

export async function getEffectiveTierConfig(env, role) {
  const base = TIER_CONFIG[role];
  if (!base) return base;
  const overrides = await getTierOverrides(env);
  const ov = overrides[role];
  if (!ov) return base;
  const merged = { ...base };
  if (typeof ov.dailyLinks === "number") merged.dailyLinks = ov.dailyLinks;
  if (typeof ov.maxBulkBatch === "number") merged.maxBulkBatch = ov.maxBulkBatch;
  if (typeof ov.monthlyApiLimit === "number") merged.monthlyApiLimit = ov.monthlyApiLimit;
  return merged;
}

export async function checkDailyQuota(env, user, role, addCount) {
  if (role === "admin") return { ok: true };
  const limit = (await getEffectiveTierConfig(env, role)).dailyLinks;
  const today = todayStr();
  let currentCount = 0;
  if (user && user.dailyQuota && user.dailyQuota.date === today) {
    currentCount = user.dailyQuota.count;
  }
  if (currentCount + addCount > limit) {
    const tierName = role === "guest" ? "Khách chưa đăng ký" : role === "free" ? "Registered (Miễn phí)" : role === "plus" ? "Plus" : role === "pro" ? "Pro" : "Super";
    return { ok: false, message: `Bạn đã vượt quá giới hạn ${limit} link/ngày của gói ${tierName} (đã tạo ${currentCount} link hôm nay).` };
  }
  return { ok: true };
}

export async function incrementDailyQuota(env, ownerUsername, count) {
  const user = await getUser(env, ownerUsername);
  if (!user) return;
  const today = todayStr();
  if (!user.dailyQuota || user.dailyQuota.date !== today) {
    user.dailyQuota = { date: today, count };
  } else {
    user.dailyQuota.count += count;
  }
  await putUser(env, user);
}

export async function checkMonthlyApiQuota(env, user, role) {
  if (role === "admin") return { ok: true };
  if (user && user.tierExpiresAt && role !== "admin" && new Date(user.tierExpiresAt) < new Date()) {
    return { ok: false, code: "TIER_EXPIRED", message: "Gói của bạn đã hết hạn. Vui lòng nâng cấp để tiếp tục sử dụng API.", upgradeUrl: "#/pricing" };
  }
  if (!TIER_CONFIG[role].hasApi) {
    return { ok: false, code: "API_NOT_AVAILABLE", message: "Gói hiện tại chưa hỗ trợ API. Nâng cấp PRO hoặc SUPER để sử dụng.", upgradeUrl: "#/pricing" };
  }
  const limit = (await getEffectiveTierConfig(env, role)).monthlyApiLimit;
  const thisMonth = thisMonthStr();
  let currentCount = 0;
  if (user && user.monthlyApiQuota && user.monthlyApiQuota.month === thisMonth) {
    currentCount = user.monthlyApiQuota.count;
  }
  if (currentCount >= limit) {
    return { ok: false, code: "QUOTA_EXCEEDED", message: `Bạn đã dùng hết hạn mức API ${limit.toLocaleString()} requests/tháng. Vui lòng nâng cấp để tăng giới hạn.`, upgradeUrl: "#/pricing", retryAt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString() };
  }
  return { ok: true };
}

export async function incrementMonthlyApiQuota(env, ownerUsername) {
  const user = await getUser(env, ownerUsername);
  if (!user) return;
  const thisMonth = thisMonthStr();
  if (!user.monthlyApiQuota || user.monthlyApiQuota.month !== thisMonth) {
    user.monthlyApiQuota = { month: thisMonth, count: 1 };
  } else {
    user.monthlyApiQuota.count += 1;
  }
  await putUser(env, user);
}

export function checkMonthlyDynamicQrQuota(user, role) {
  if (role === "admin") return { ok: true, limit: 999999, remaining: 999999 };
  const limit = (TIER_CONFIG[role] && TIER_CONFIG[role].maxDynamicQrPerMonth) || 0;
  if (!limit) {
    return { ok: false, code: "DYNAMIC_QR_NOT_AVAILABLE", message: "Gói hiện tại chưa hỗ trợ QR động. Nâng cấp Plus trở lên để sử dụng.", upgradeUrl: "#/pricing" };
  }
  const thisMonth = thisMonthStr();
  let currentCount = 0;
  if (user && user.monthlyDynamicQrQuota && user.monthlyDynamicQrQuota.month === thisMonth) {
    currentCount = user.monthlyDynamicQrQuota.count;
  }
  if (currentCount >= limit) {
    return { ok: false, code: "QUOTA_EXCEEDED", message: `Bạn đã dùng hết ${limit} QR động/tháng. Các QR động đã tạo vẫn hoạt động bình thường — nâng cấp gói để tạo thêm.`, upgradeUrl: "#/pricing", limit: limit, remaining: 0, retryAt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString() };
  }
  return { ok: true, limit: limit, remaining: limit - currentCount };
}

export async function incrementMonthlyDynamicQrQuota(env, ownerUsername) {
  const user = await getUser(env, ownerUsername);
  if (!user) return;
  const thisMonth = thisMonthStr();
  if (!user.monthlyDynamicQrQuota || user.monthlyDynamicQrQuota.month !== thisMonth) {
    user.monthlyDynamicQrQuota = { month: thisMonth, count: 1 };
  } else {
    user.monthlyDynamicQrQuota.count += 1;
  }
  await putUser(env, user);
}
