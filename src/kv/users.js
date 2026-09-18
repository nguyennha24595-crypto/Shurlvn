// KV: users — CRUD + safeUser (strips salt/hash before sending to client).

export function safeUser(u) {
  if (!u) return null;
  const { salt, hash, ...rest } = u;
  return rest;
}

export async function getUser(env, username) {
  if (!username) return null;
  const raw = await env.LINKS_KV.get("user:" + username.toLowerCase());
  return raw ? JSON.parse(raw) : null;
}

export async function putUser(env, user) {
  await env.LINKS_KV.put("user:" + user.username.toLowerCase(), JSON.stringify(user));
}

export async function listAllUsers(env) {
  if (env._usersCache && env._usersCacheTime && (Date.now() - env._usersCacheTime < 30000)) { return env._usersCache; }
  const users = [];
  let cursor;
  do {
    const page = await env.LINKS_KV.list({ prefix: "user:", cursor });
    const keys = page.keys.map(function(k){ return k.name; });
    const results = await Promise.all(keys.map(function(k){ return env.LINKS_KV.get(k); }));
    for (var i = 0; i < results.length; i++) {
      if (results[i]) users.push(JSON.parse(results[i]));
    }
    cursor = page.cursor;
    if (page.list_complete) break;
  } while (cursor);
  env._usersCache = users; env._usersCacheTime = Date.now(); return users;
}
