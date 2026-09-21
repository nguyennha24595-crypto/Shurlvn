// KV: click tracking, click analytics computation, and user-agent parsing.

import { getClientIp } from "../utils/http.js";
import { randomHex } from "../utils/crypto.js";
import { putLink } from "./links.js";
import { getUser } from "./users.js";

export async function getClicks(env, code) {
  const raw = await env.LINKS_KV.get("clicks:" + code);
  return raw ? JSON.parse(raw) : [];
}

export async function putClicks(env, code, clicks) {
  // Giữ tối đa 500 lượt click gần nhất mỗi link để tránh phình KV value quá lớn.
  const trimmed = clicks.length > 500 ? clicks.slice(clicks.length - 500) : clicks;
  await env.LINKS_KV.put("clicks:" + code, JSON.stringify(trimmed));
}

export function parseUserAgent(userAgent) {
  const isMobile = /Mobile|Android|iPhone/i.test(userAgent);
  const isTablet = /iPad|Tablet/i.test(userAgent);
  const device = isTablet ? "Tablet" : isMobile ? "Mobile" : "Desktop";

  let browser = "Chrome";
  if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) browser = "Safari";
  else if (/Firefox/i.test(userAgent)) browser = "Firefox";
  else if (/Edge/i.test(userAgent)) browser = "Edge";
  else if (/Zalo/i.test(userAgent)) browser = "Zalo InApp";

  let os = "Windows";
  if (/iPhone|iPad/i.test(userAgent)) os = "iOS";
  else if (/Android/i.test(userAgent)) os = "Android";
  else if (/Macintosh|Mac OS/i.test(userAgent)) os = "macOS";
  else if (/Linux/i.test(userAgent)) os = "Linux";

  return { device, browser, os };
}

export async function recordClick(request, env, code, link) {
  try {
    const userAgent = request.headers.get("User-Agent") || "";
    const ip = getClientIp(request);
    const referrerHeader = request.headers.get("Referer") || "";
    let referrer = "Direct";
    if (referrerHeader.startsWith("http")) {
      try { referrer = new URL(referrerHeader).hostname; } catch (e) { referrer = referrerHeader; }
    }
    const cfCountry = request.cf && request.cf.country;
    const cfCity = request.cf && request.cf.city;
    const { device, browser, os } = parseUserAgent(userAgent);

    const click = {
      id: "clk_" + randomHex(6),
      code,
      timestamp: new Date().toISOString(),
      ip,
      device, browser, os,
      country: cfCountry || "Việt Nam",
      city: cfCity || "",
      referrer
    };

    link.totalClicks = (link.totalClicks || 0) + 1;
    await putLink(env, link);

    const clicks = await getClicks(env, code);
    clicks.push(click);
    await putClicks(env, code, clicks);
    
    // ===== WEBHOOK TRIGGER (Pro/Super) =====
    try {
      const owner = link.owner;
      if (owner) {
        const ownerUser = await getUser(env, owner);
        if (ownerUser && (ownerUser.role === "pro" || ownerUser.role === "super")) {
          const hooksRaw = await env.LINKS_KV.get("webhooks:" + owner.toLowerCase());
          const hooks = hooksRaw ? JSON.parse(hooksRaw) : [];
          for (const hook of hooks) {
            if (!hook.url || !hook.isActive) continue;
            try {
              await fetch(hook.url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  event: "click",
                  link: { code: link.code, url: link.url },
                  click: click,
                  timestamp: new Date().toISOString()
                })
              });
            } catch (whErr) { console.error("webhook dispatch failed:", whErr); }
          }
        }
      }
    } catch (whOuterErr) { console.error("webhook trigger failed:", whOuterErr); }
  } catch (e) {
    console.error("recordClick failed:", e);
  }
}

export function computeLinkAnalytics(link, clicks) {
  const now = Date.now();
  const oneDayAgo = now - 24 * 3600 * 1000;
  const sevenDaysAgo = now - 7 * 24 * 3600 * 1000;
  const thirtyDaysAgo = now - 30 * 24 * 3600 * 1000;

  let todayClicks = 0, clicks7d = 0, clicks30d = 0;

  const hoursMap = {};
  for (let i = 0; i < 24; i++) hoursMap[`${i.toString().padStart(2, "0")}:00`] = 0;

  const daysMap = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now - i * 24 * 3600 * 1000);
    daysMap[d.toISOString().slice(5, 10)] = 0;
  }

  const deviceCount = { Mobile: 0, Desktop: 0, Tablet: 0, Other: 0 };
  const countryCount = {};
  const referrerCount = {};
  const browserCount = {};
  const osCount = {};

  for (const c of clicks) {
    const t = new Date(c.timestamp).getTime();
    if (t >= oneDayAgo) todayClicks++;
    if (t >= sevenDaysAgo) clicks7d++;
    if (t >= thirtyDaysAgo) clicks30d++;

    const hourKey = `${new Date(c.timestamp).getHours().toString().padStart(2, "0")}:00`;
    if (hoursMap[hourKey] !== undefined) hoursMap[hourKey]++;

    const dayKey = c.timestamp.slice(5, 10);
    if (daysMap[dayKey] !== undefined) daysMap[dayKey]++;

    deviceCount[c.device] = (deviceCount[c.device] || 0) + 1;
    const countryName = c.country || "Việt Nam";
    countryCount[countryName] = (countryCount[countryName] || 0) + 1;
    const ref = c.referrer || "Direct";
    referrerCount[ref] = (referrerCount[ref] || 0) + 1;
    browserCount[c.browser] = (browserCount[c.browser] || 0) + 1;
    osCount[c.os] = (osCount[c.os] || 0) + 1;
  }

  const total = clicks.length || 1;
  const deviceBreakdown = Object.entries(deviceCount).map(([name, value]) => ({ name, value, percent: Math.round((value / total) * 100) }));
  const countryBreakdown = Object.entries(countryCount).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({
    name, code: name === "Việt Nam" ? "VN" : name === "Hoa Kỳ" ? "US" : "GLOBAL", count, percent: Math.round((count / total) * 100)
  }));
  const referrerBreakdown = Object.entries(referrerCount).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count, percent: Math.round((count / total) * 100) }));
  const browserBreakdown = Object.entries(browserCount).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));
  const osBreakdown = Object.entries(osCount).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));

  const timeline24h = Object.entries(hoursMap).map(([hour, c]) => ({ hour, clicks: c }));
  const timeline30d = Object.entries(daysMap).map(([date, c]) => ({ date, clicks: c }));

  return {
    code: link.code, url: link.url, title: link.title,
    totalClicks: link.totalClicks || clicks.length,
    todayClicks, clicks7d, clicks30d,
    timeline24h, timeline30d,
    deviceBreakdown, countryBreakdown, referrerBreakdown, browserBreakdown, osBreakdown,
    recentClicks: clicks.slice(-50).reverse()
  };
}
