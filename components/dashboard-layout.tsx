"use client";

import type React from "react";
import { Sidebar } from "@/components/sidebar";
import { usePathname } from "next/navigation";
import { Bell, Check, X, ClipboardList, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "task" | "note" | "reminder" | "system";
  is_read: boolean;
  created_at: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const supabase = createClient();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let channel: any;

    const setupNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      //  Fetch initial notifications
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter((n: AppNotification) => !n.is_read).length);
      }

      //  Subscribe to real-time changes with user filter
      channel = supabase
        .channel(`user_notifications_${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*", // Listen to INSERT, UPDATE, and DELETE
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log("[Realtime] Notification change received:", payload.eventType, payload.new || payload.old);

            if (payload.eventType === "INSERT") {
              const newNotif = payload.new as AppNotification;
              setNotifications((prev) => {
                if (prev.some(n => n.id === newNotif.id)) return prev;
                return [newNotif, ...prev.slice(0, 9)];
              });
              setUnreadCount((prev) => prev + 1);
            } else if (payload.eventType === "UPDATE") {
              const updatedNotif = payload.new as AppNotification;
              setNotifications((prev) =>
                prev.map((n) => (n.id === updatedNotif.id ? updatedNotif : n))
              );
              // Recalculate unread count based on the updated notification
              setUnreadCount((prev) => {
                const wasUnread = notifications.find(n => n.id === updatedNotif.id)?.is_read === false;
                if (wasUnread && updatedNotif.is_read) return Math.max(0, prev - 1);
                if (!wasUnread && !updatedNotif.is_read) return prev + 1;
                return prev;
              });
            } else if (payload.eventType === "DELETE") {
              const deletedId = (payload.old as any).id;
              setNotifications((prev) => prev.filter((n) => n.id !== deletedId));
              // Update unread count if a deleted notification was unread
              setUnreadCount((prev) => {
                const wasUnread = notifications.find(n => n.id === deletedId)?.is_read === false;
                return wasUnread ? Math.max(0, prev - 1) : prev;
              });
            }
          }
        )
        .subscribe((status) => {
          console.log(`[Realtime] Subscription status for user ${user.id}:`, status);
        });
    };

    setupNotifications();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const markAsRead = async (id: string) => {
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", unreadIds);

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const clearAll = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("notifications").delete().eq("user_id", user.id);
    setNotifications([]);
    setUnreadCount(0);
  };

  const getNotificationIcon = (type: AppNotification["type"]) => {
    switch (type) {
      case "task":
        return (
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <ClipboardList className="h-3.5 w-3.5 text-primary" strokeWidth={1.25} />
          </div>
        );
      case "note":
        return (
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <FileText className="h-3.5 w-3.5 text-emerald-500" strokeWidth={1.25} />
          </div>
        );
      case "reminder":
        return (
          <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Clock className="h-3.5 w-3.5 text-amber-500" strokeWidth={1.25} />
          </div>
        );
      default:
        return (
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bell className="h-3.5 w-3.5 text-primary" strokeWidth={1.25} />
          </div>
        );
    }
  };

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard Overview";
    if (pathname === "/dashboard/kanban") return "Task Management";
    if (pathname === "/dashboard/notes") return "Notes & Documentation";
    if (pathname === "/dashboard/calendar") return "Calendar & Schedule";
    if (pathname === "/dashboard/settings") return "Settings & Preferences";
    return "Dashboard";
  };

  const getPageSubtext = () => {
    if (pathname === "/dashboard")
      return "A quick snapshot of what matters today.";
    if (pathname === "/dashboard/kanban")
      return "Plan, prioritize, and move work forward.";
    if (pathname === "/dashboard/notes")
      return "Capture ideas, docs, and decisions in one place.";
    if (pathname === "/dashboard/calendar")
      return "See deadlines and upcoming work at a glance.";
    if (pathname === "/dashboard/settings")
      return "Manage your preferences and workspace setup.";
    return "Stay organized and in control.";
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground grid-bg">
      <Sidebar />

      <main className="flex-1 overflow-auto p-4 md:p-6 pt-16 md:pt-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              {getPageTitle()}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">{getPageSubtext()}</p>
          </div>

          <Popover >
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-lg bg-rimary text-primary-foreground hover:bg-primary/90 hidden md:flex items-center justify-center transition-all duration-200"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-background text-primary text-[10px] font-bold flex items-center justify-center ring ring-primary/20">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[380px] p-0 dark-card border-border/40 shadow-2xl overflow-hidden" sideOffset={12}>
              <div className="flex items-center justify-between p-4 bg-muted/30 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-[11px] font-medium hover:bg-transparent hover:text-primary transition-colors"
                      onClick={markAllAsRead}
                    >
                      <Check className="h-2.5 w-2.5" />
                      Mark all read
                    </Button>
                  )}
                  {notifications.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-[11px] font-medium text-muted-foreground hover:bg-transparent hover:text-destructive transition-colors"
                      onClick={clearAll}  
                    >
                      <X className="h-2.5 w-2.5" />
                      Clear all
                    </Button>
                  )}
                </div>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-10 flex flex-col items-center justify-center text-center">
                    <div className="h-12 w-12 rounded-full bg-muted/30 flex items-center justify-center mb-3">
                      <Bell className="h-6 w-6 text-muted-foreground/40" strokeWidth={1.25} />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">All caught up!</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 border-b border-border/20 last:border-0 hover:bg-muted/30 transition-all cursor-pointer group relative",
                        !notification.is_read && "bg-primary/[0.03]"
                      )}
                      onClick={() => {
                        if (!notification.is_read) markAsRead(notification.id);
                      }}
                    >
                      <div className="flex gap-4">
                        <div className="shrink-0 pt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={cn(
                              "text-[13px] leading-tight truncate transition-colors",
                              !notification.is_read ? "font-semibold text-foreground" : "font-medium text-muted-foreground group-hover:text-foreground"
                            )}>
                              {notification.title}
                            </p>
                            {!notification.is_read && (
                              <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1 shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="h-3 w-3 text-muted-foreground/40" />
                            <p className="text-[10px] font-medium text-muted-foreground/60">
                              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {children}
      </main>
    </div>
  );
}
