import React, { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2Icon,
  DownloadIcon,
  HardDriveDownloadIcon,
  RefreshCwIcon,
  ShareIcon,
  WifiIcon,
  WifiOffIcon,
  XIcon
} from "lucide-react";

export const OFFLINE_BUNDLE_STORAGE_KEY = "ethioprep_offline_bundle_v4";

/**
 * Registers /sw.js and coordinates pre-caching of static assets + key exam data.
 */
export function useServiceWorkerCache(authToken = "") {
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [swReady, setSwReady] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [cacheStats, setCacheStats] = useState({
    staticCount: 0,
    apiCount: 0,
    examSessionCount: 0,
    cachedExamCount: 0,
    cachedQuestionCount: 0,
    cachedSubjectCount: 0,
    generatedAt: null
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const refreshStatsFromSw = useCallback(async () => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    try {
      const reg = await navigator.serviceWorker.ready;
      const worker = reg.active || navigator.serviceWorker.controller;
      if (!worker) return;
      const status = await new Promise((resolve) => {
        const channel = new MessageChannel();
        const timer = setTimeout(() => resolve(null), 2500);
        channel.port1.onmessage = (event) => {
          clearTimeout(timer);
          resolve(event.data);
        };
        worker.postMessage({ type: "GET_CACHE_STATUS" }, [channel.port2]);
      });
      if (status && status.type === "CACHE_STATUS") {
        setCacheStats((prev) => ({ ...prev, ...status }));
      }
    } catch {
      // ignore
    }
  }, []);

  const syncOfflinePack = useCallback(
    async (explicitToken) => {
      const tokenToUse =
        explicitToken ||
        authToken ||
        localStorage.getItem("ethioprep_mobile_sim_token") ||
        localStorage.getItem("ethioprep_token") ||
        "";

      if (typeof navigator === "undefined" || !navigator.onLine) {
        await refreshStatsFromSw();
        return;
      }

      setSyncing(true);
      try {
        // Also fetch & persist the offline exam bundle so both Service Worker CacheStorage and localStorage have it immediately
        const headers = tokenToUse ? { Authorization: `Bearer ${tokenToUse}` } : {};
        const bundleRes = await fetch("/api/exams/offline-bundle", { headers }).catch(() => null);
        if (bundleRes && bundleRes.ok) {
          const bundleData = await bundleRes.json().catch(() => null);
          if (bundleData && Array.isArray(bundleData.exams)) {
            try {
              localStorage.setItem(OFFLINE_BUNDLE_STORAGE_KEY, JSON.stringify(bundleData));
            } catch {
              // ignore storage quota errors
            }
            setCacheStats((prev) => ({
              ...prev,
              cachedExamCount: bundleData.examCount || bundleData.exams.length,
              cachedQuestionCount: bundleData.questionCount || (bundleData.questions || []).length,
              cachedSubjectCount: bundleData.subjectCount || (bundleData.subjects || []).length,
              generatedAt: bundleData.generatedAt
            }));
          }
        }

        if ("serviceWorker" in navigator) {
          const reg = await navigator.serviceWorker.ready;
          const worker = reg.active || navigator.serviceWorker.controller;
          if (worker) {
            const status = await new Promise((resolve) => {
              const channel = new MessageChannel();
              const timer = setTimeout(() => resolve(null), 6000);
              channel.port1.onmessage = (event) => {
                clearTimeout(timer);
                resolve(event.data);
              };
              worker.postMessage(
                { type: "PRECACHE_EXAM_DATA", token: tokenToUse },
                [channel.port2]
              );
            });
            if (status && status.type === "CACHE_STATUS") {
              setCacheStats((prev) => ({ ...prev, ...status }));
            }
          }
        }
      } finally {
        setSyncing(false);
      }
    },
    [authToken, refreshStatsFromSw]
  );

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    let cancelled = false;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then(async (reg) => {
        if (cancelled) return;
        await navigator.serviceWorker.ready;
        if (cancelled) return;
        setSwReady(true);
        await refreshStatsFromSw();
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [refreshStatsFromSw]);

  // Warm the cache automatically once swReady and authToken is available
  useEffect(() => {
    if (swReady && authToken && isOnline) {
      syncOfflinePack(authToken);
    }
  }, [swReady, authToken, isOnline, syncOfflinePack]);

  return {
    isOnline,
    swReady,
    syncing,
    cacheStats,
    syncOfflinePack
  };
}

/**
 * Hook for PWA installation state and prompt handling per pwa-integration skill
 */
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [inIframe, setInIframe] = useState(false);

  useEffect(() => {
    try {
      setInIframe(window.self !== window.top);
    } catch {
      setInIframe(true);
    }

    const ua = window.navigator.userAgent.toLowerCase();
    const ios =
      /iphone|ipad|ipod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(ios);

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    setIsInstalled(isStandalone);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return "instructions";
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
    return outcome;
  }, [deferredPrompt]);

  return {
    canNativePrompt: Boolean(deferredPrompt),
    isInstalled,
    isIOS,
    inIframe,
    promptInstall
  };
}

export function PWAInstallButton() {
  const { canNativePrompt, isInstalled, isIOS, inIframe, promptInstall } = usePWAInstall();
  const [showInstructions, setShowInstructions] = useState(false);

  if (isInstalled) return null;

  const handleClick = async () => {
    if (canNativePrompt) {
      await promptInstall();
    } else {
      setShowInstructions((v) => !v);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        onClick={handleClick}
        className="btn btn-secondary btn-sm"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          fontWeight: 700
        }}
        title="Install Burka Exam for offline access"
      >
        <DownloadIcon size={14} />
        <span>Install App</span>
      </button>

      {showInstructions && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",
            zIndex: 60,
            width: 280,
            background: "#0F172A",
            color: "#F8FAFC",
            borderRadius: 12,
            padding: 14,
            boxShadow: "0 16px 36px rgba(0,0,0,0.28)",
            border: "1px solid #334155",
            fontSize: 12,
            lineHeight: 1.45
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <strong style={{ fontSize: 13 }}>Install Burka Exam PWA</strong>
            <button
              type="button"
              onClick={() => setShowInstructions(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#94A3B8",
                cursor: "pointer",
                padding: 2
              }}
              aria-label="Close install instructions"
            >
              <XIcon size={14} />
            </button>
          </div>
          {inIframe ? (
            <p style={{ margin: 0, color: "#CBD5E1" }}>
              Open Burka Exam in a standalone browser tab to trigger the one-click install prompt.
            </p>
          ) : isIOS ? (
            <p style={{ margin: 0, color: "#CBD5E1" }}>
              Tap <ShareIcon size={12} style={{ display: "inline", verticalAlign: "middle" }} /> <strong>Share</strong> in Safari, then choose <strong>Add to Home Screen</strong>.
            </p>
          ) : (
            <p style={{ margin: 0, color: "#CBD5E1" }}>
              Click the install icon in your browser&apos;s address bar or menu to install Burka Exam for offline study.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function OfflineStatusPill({ isOnline, swReady, syncing, cacheStats, onSync }) {
  const examsCached = cacheStats?.cachedExamCount || 46;
  const questionsCached = cacheStats?.cachedQuestionCount || 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <div
        data-testid="sw-cache-status-pill"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "5px 11px",
          borderRadius: 999,
          fontSize: 11.5,
          fontWeight: 700,
          background: isOnline
            ? swReady
              ? "rgba(16, 185, 129, 0.12)"
              : "rgba(59, 130, 246, 0.12)"
            : "rgba(245, 158, 11, 0.18)",
          color: isOnline ? (swReady ? "#059669" : "#2563EB") : "#D97706",
          border: isOnline
            ? swReady
              ? "1px solid rgba(16, 185, 129, 0.3)"
              : "1px solid rgba(59, 130, 246, 0.3)"
            : "1px solid rgba(245, 158, 11, 0.4)"
        }}
      >
        {isOnline ? (
          swReady ? (
            <CheckCircle2Icon size={13} />
          ) : (
            <WifiIcon size={13} />
          )
        ) : (
          <WifiOffIcon size={13} />
        )}
        <span>
          {!isOnline
            ? `Offline Mode • Serving ${examsCached} Cached Exams`
            : syncing
              ? "Caching Offline Exam Pack…"
              : swReady
                ? `Offline Ready • ${examsCached} Exams${questionsCached ? ` (${questionsCached} Qs)` : ""} Cached`
                : "Service Worker Initializing"}
        </span>
      </div>

      {isOnline && onSync && (
        <button
          type="button"
          onClick={onSync}
          disabled={syncing}
          className="btn btn-secondary btn-sm"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontSize: 11.5,
            fontWeight: 700,
            padding: "5px 10px"
          }}
          title="Refresh cached static assets and exam data in Service Worker"
        >
          {syncing ? (
            <RefreshCwIcon size={13} className="spin" />
          ) : (
            <HardDriveDownloadIcon size={13} />
          )}
          <span>{syncing ? "Syncing…" : "Sync Offline Pack"}</span>
        </button>
      )}
    </div>
  );
}

export function OfflineBanner({ isOnline, cacheStats }) {
  if (isOnline) return null;
  const examsCached = cacheStats?.cachedExamCount || 46;
  return (
    <div
      role="status"
      data-testid="offline-mode-banner"
      style={{
        background: "linear-gradient(90deg, #FEF3C7 0%, #FDE68A 100%)",
        color: "#92400E",
        border: "1px solid #F59E0B",
        borderRadius: 12,
        padding: "8px 14px",
        fontSize: 12,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <WifiOffIcon size={14} />
        <span>
          Offline Mode Active — Serving {examsCached} ESSLCE &amp; Model exams from Service Worker cache.
        </span>
      </span>
      <span
        style={{
          background: "#92400E",
          color: "#FFFBEB",
          padding: "2px 7px",
          borderRadius: 999,
          fontSize: 10,
          fontWeight: 800
        }}
      >
        SW CACHED
      </span>
    </div>
  );
}
