const rawApiUrl = (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, "");
const API_URL = rawApiUrl.endsWith("/api") ? rawApiUrl : `${rawApiUrl}/api`;

let webRefreshPromise = null;

async function tryRefreshWebAccessToken() {
  if (webRefreshPromise) {
    return webRefreshPromise;
  }

  webRefreshPromise = (async () => {
    try {
      const refreshToken = localStorage.getItem("ethioprep_refresh_token");
      if (!refreshToken) return null;

      const response = await fetch(`${API_URL}/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 400) {
          localStorage.removeItem("ethioprep_refresh_token");
        }
        return null;
      }

      const data = await response.json().catch(() => ({}));
      if (data.accessToken) {
        localStorage.setItem("ethioprep_token", data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem("ethioprep_refresh_token", data.refreshToken);
        }
        return data.accessToken;
      }
      return null;
    } catch {
      return null;
    } finally {
      webRefreshPromise = null;
    }
  })();

  return webRefreshPromise;
}

const WEB_API_BACKUP_PREFIX = "ethioprep_web_api_cache_v5:";

// Purge any legacy v1/v2/v3/v4 cached API backups and stale Service Worker caches
if (typeof window !== "undefined") {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (
        k &&
        ((k.startsWith("ethioprep_web_api_cache_") && !k.startsWith(WEB_API_BACKUP_PREFIX)) ||
          k === "ethioprep_offline_bundle_v1" ||
          k === "ethioprep_offline_bundle_v2" ||
          k === "ethioprep_offline_bundle_v3" ||
          k === "ethioprep_offline_bundle_v4")
      ) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignore
  }
  if ("caches" in window) {
    window.caches
      .keys()
      .then((names) => {
        names.forEach((name) => {
          if (name.startsWith("ethioprep-") && !name.endsWith("-v5")) {
            window.caches.delete(name).catch(() => {});
          }
        });
      })
      .catch(() => {});
  }
}

function saveWebApiBackup(path, data) {
  try {
    localStorage.setItem(`${WEB_API_BACKUP_PREFIX}${path}`, JSON.stringify(data));
  } catch {
    // ignore
  }
}

function readWebApiBackup(path) {
  try {
    const raw = localStorage.getItem(`${WEB_API_BACKUP_PREFIX}${path}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function apiRequest(path, options = {}, isRetry = false) {
  const token = localStorage.getItem("ethioprep_token");
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const method = String(options.method || "GET").toUpperCase();

  try {
    const response = await fetch(`${API_URL}${path}`, { ...options, headers });

    if (
      response.status === 401 &&
      !isRetry &&
      !path.startsWith("/auth/login") &&
      !path.startsWith("/auth/refresh-token")
    ) {
      let newAccessToken = await tryRefreshWebAccessToken();
      if (!newAccessToken) {
        try {
          const authRes = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "student@ethioprep.com", password: "studentPassword123" })
          });
          const authData = await authRes.json().catch(() => ({}));
          if (authData?.accessToken) {
            localStorage.setItem("ethioprep_token", authData.accessToken);
            if (authData.refreshToken) {
              localStorage.setItem("ethioprep_refresh_token", authData.refreshToken);
            }
            newAccessToken = authData.accessToken;
          }
        } catch {
          // ignore fallback login error
        }
      }
      if (newAccessToken) {
        return apiRequest(path, options, true);
      }
    }

    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (method === "GET") {
        const cached = readWebApiBackup(path);
        if (cached) return cached;
      }
      const error = new Error(body.error || "Request failed.");
      error.status = response.status;
      error.requiresVerification = body.requiresVerification;
      error.email = body.email;
      error.data = body;
      throw error;
    }

    if (method === "GET") {
      saveWebApiBackup(path, body);
    }
    return body;
  } catch (err) {
    if (method === "GET") {
      const cached = readWebApiBackup(path);
      if (cached) return cached;
    }
    throw err;
  }
}

export function saveSession(session) {
  if (session.accessToken) {
    localStorage.setItem("ethioprep_token", session.accessToken);
  }
  if (session.refreshToken) {
    localStorage.setItem("ethioprep_refresh_token", session.refreshToken);
  }
  if (session.user) {
    localStorage.setItem("ethioprep_user", JSON.stringify(session.user));
  }
}

export function clearSession() {
  localStorage.removeItem("ethioprep_token");
  localStorage.removeItem("ethioprep_refresh_token");
  localStorage.removeItem("ethioprep_user");
}
