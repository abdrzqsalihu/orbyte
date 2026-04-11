"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function isStandaloneMode() {
    if (typeof window === "undefined") return false;
    return (
        window.matchMedia("(display-mode: standalone)").matches ||
        window.matchMedia("(display-mode: window-controls-overlay)").matches ||
        document.referrer.startsWith("android-app://") ||
        Boolean(
            (
                window.navigator as Navigator & {
                    standalone?: boolean;
                }
            ).standalone,
        )
    );
}

export function PwaProvider() {
    const pathname = usePathname();

    useEffect(() => {
        const isStandalone = isStandaloneMode();
        if (!isStandalone) return;
        // Handle session-based initial redirect from / to /dashboard
        // Only redirect if it's a direct entry (no internal referrer)
        if (pathname === "/") {
            const sessionRedirectKey = "orbyte-initial-redirect-done";
            const hasRedirected = sessionStorage.getItem(sessionRedirectKey);

            if (!hasRedirected) {
                const isInternalNavigation = document.referrer && document.referrer.includes(window.location.host);

                if (!isInternalNavigation) {
                    sessionStorage.setItem(sessionRedirectKey, "true");
                    window.location.replace("/dashboard");
                } else {
                    // Mark as done if navigated internally to /
                    sessionStorage.setItem(sessionRedirectKey, "true");
                }
            }
        } else if (pathname !== "/dashboard") {
            // If users land on any other page first, consider the initial "entry" redirect handled
            sessionStorage.setItem("orbyte-initial-redirect-done", "true");
        }
    }, [pathname]);

    useEffect(() => {
        if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) {
            return;
        }

        const registerServiceWorker = async () => {
            try {
                await navigator.serviceWorker.register("/sw.js", {
                    scope: "/",
                });
            } catch (error) {
                console.error("Service worker registration failed", error);
            }
        };

        window.addEventListener("load", registerServiceWorker);

        return () => {
            window.removeEventListener("load", registerServiceWorker);
        };
    }, []);

    useEffect(() => {
        const handleAppInstalled = () => {
            if (pathname === "/") {
                window.location.replace("/dashboard");
            }
        };

        window.addEventListener("appinstalled", handleAppInstalled);

        return () => {
            window.removeEventListener("appinstalled", handleAppInstalled);
        };
    }, [pathname]);

    return null;
}
