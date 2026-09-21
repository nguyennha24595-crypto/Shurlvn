// Session/API-token auth resolution and auth-guard response helpers.

import { parseCookies, json } from "./http.js";
import { SESSION_COOKIE, OAUTH_STATE_COOKIE } from "../config/constants.js";
import { st } from "../i18n/server.js";
import { getUser, putUser, safeUser } from "../kv/users.js";

export async function getAuthenticatedUser(request, env) {
  try {
    const cookies = parseCookies(request);
    const sessionToken = cookies[SESSION_COOKIE];
    if (sessionToken) {
      const username = await env.LINKS_KV.get("session:" + sessionToken);
      if (username) {
        const user = await getUser(env, username);
        if (user) {
          if (user.banned) return null;
          return safeUser(user);
        }
      }
    }

    const authHeader = request.headers.get("Authorization");
    const apiKeyHeader = request.headers.get("x-api-key");
    const rawToken = (authHeader || apiKeyHeader || "").replace(/^Bearer\s+/i, "").trim();
    if (rawToken) {
      const username = await env.LINKS_KV.get("apitoken:" + rawToken);
      if (username) {
        const user = await getUser(env, username);
        if (user) {
          if (user.banned) return null;
          if (user.tierExpiresAt && user.role !== "admin" && new Date(user.tierExpiresAt) < new Date()) {
            user.role = "free";
            user.tierExpiresAt = null;
            await putUser(env, user);
          }
          return safeUser(user);
        }
      }
    }
  } catch(e) { /* KV error - treat as unauthenticated */ }
  return null;
}

export function requireAuthResponse(corsHeaders, request) {
  return json({ error: st("require_auth", request) }, 401, corsHeaders);
}

export function requireAdminResponse(corsHeaders, request) {
  return json({ error: st("require_admin", request) }, 403, corsHeaders);
}

export function clearOauthStateCookieHeader() {
  return `${OAUTH_STATE_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0`;
}
