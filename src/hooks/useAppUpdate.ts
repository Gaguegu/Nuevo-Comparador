import { useState, useEffect, useCallback, useRef } from 'react';

// Declared in vite-env.d.ts
declare const __APP_BUILD_TIME__: number;
declare const __APP_VERSION__: string;

interface VersionPayload {
  version: string;
  buildTime: number;
  buildDate: string;
}

export function useAppUpdate() {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const waitingWorkerRef = useRef<ServiceWorker | null>(null);
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

  // Determine base URL
  const rawBase = import.meta.env.BASE_URL || './';
  const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

  // Check version.json on server
  const checkServerVersion = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch(`${base}version.json?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      });

      if (!response.ok) return false;

      const data: VersionPayload = await response.json();
      const currentBuildTime = typeof __APP_BUILD_TIME__ !== 'undefined' ? __APP_BUILD_TIME__ : 0;

      // If remote build is newer than current app build
      if (data.buildTime && currentBuildTime && data.buildTime > currentBuildTime + 5000) {
        return true;
      }
    } catch {
      // Network or parse error - silent fallback
    }
    return false;
  }, [base]);

  // Master check function (can be called manually from button or automatically)
  const checkForUpdates = useCallback(
    async (isManual = false): Promise<boolean> => {
      setIsChecking(true);
      if (isManual) {
        setStatusMessage('Comprobando si hay actualizaciones...');
      }

      let foundUpdate = false;

      // 1. Service Worker update check
      if ('serviceWorker' in navigator) {
        try {
          const reg = await navigator.serviceWorker.getRegistration();
          if (reg) {
            registrationRef.current = reg;

            // Check if there's already a worker waiting
            if (reg.waiting) {
              waitingWorkerRef.current = reg.waiting;
              foundUpdate = true;
            } else {
              // Trigger a check with the server
              await reg.update();
              if (reg.waiting) {
                waitingWorkerRef.current = reg.waiting;
                foundUpdate = true;
              }
            }
          }
        } catch {
          // SW check error fallback
        }
      }

      // 2. HTTP Version Check (very reliable on GitHub Pages)
      if (!foundUpdate) {
        const isNewVersionAvailable = await checkServerVersion();
        if (isNewVersionAvailable) {
          foundUpdate = true;
        }
      }

      setLastCheck(new Date());
      setIsChecking(false);

      if (foundUpdate) {
        setHasUpdate(true);
        setIsDismissed(false);
        setStatusMessage('¡Nueva actualización disponible!');
        return true;
      } else if (isManual) {
        setStatusMessage('Tu aplicación está al día con la última versión.');
        // Clear message after 3.5 seconds
        setTimeout(() => {
          setStatusMessage(null);
        }, 3500);
        return false;
      }

      return false;
    },
    [checkServerVersion]
  );

  // Apply update and reload
  const applyUpdate = useCallback(async () => {
    setStatusMessage('Actualizando aplicación...');

    // If waiting worker exists, send skip waiting
    if (waitingWorkerRef.current) {
      waitingWorkerRef.current.postMessage({ type: 'SKIP_WAITING' });
    } else if (registrationRef.current?.waiting) {
      registrationRef.current.waiting.postMessage({ type: 'SKIP_WAITING' });
    }

    // Try to clear non-essential caches
    if ('caches' in window) {
      try {
        const keys = await caches.keys();
        await Promise.all(
          keys
            .filter((key) => key.includes('workbox') || key.includes('ansama'))
            .map((key) => caches.delete(key))
        );
      } catch {
        // Cache delete fallback
      }
    }

    // Give the service worker a moment to claim clients and reload
    setTimeout(() => {
      window.location.reload();
    }, 300);
  }, []);

  const dismissUpdate = useCallback(() => {
    setIsDismissed(true);
  }, []);

  // Listen to Service Worker events
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    let refreshing = false;
    const handleControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return;
      registrationRef.current = reg;

      // If a service worker is already waiting to activate
      if (reg.waiting) {
        waitingWorkerRef.current = reg.waiting;
        setHasUpdate(true);
        setStatusMessage('¡Nueva actualización disponible!');
      }

      // Listen for new service worker installations
      reg.addEventListener('updatefound', () => {
        const installingWorker = reg.installing;
        if (!installingWorker) return;

        installingWorker.addEventListener('statechange', () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, new content is available and waiting
              waitingWorkerRef.current = installingWorker;
              setHasUpdate(true);
              setStatusMessage('¡Nueva actualización disponible!');
            }
          }
        });
      });
    });

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    };
  }, []);

  // Initial check & periodic checks
  useEffect(() => {
    // Delay first check slightly so initial load completes smoothly
    const initialTimer = setTimeout(() => {
      checkForUpdates(false);
    }, 2000);

    // Check periodically every 10 minutes
    const intervalTimer = setInterval(() => {
      if (navigator.onLine) {
        checkForUpdates(false);
      }
    }, 10 * 60 * 1000);

    // Check when user returns to the tab/app
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && navigator.onLine) {
        checkForUpdates(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkForUpdates]);

  return {
    hasUpdate,
    isChecking,
    statusMessage,
    isDismissed,
    lastCheck,
    checkForUpdates,
    applyUpdate,
    dismissUpdate,
    appVersion: typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '2.2.0',
  };
}
