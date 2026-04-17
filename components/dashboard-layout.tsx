"use client";

import type React from "react";
import { Sidebar } from "@/components/sidebar";
import { usePathname } from "next/navigation";
import { Bell, Check, X } from "lucide-react";
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
    const fetchNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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
    };

    fetchNotifications();

    const channel = supabase
      .channel("notifications_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          const newNotif = payload.new as AppNotification;
          setNotifications((prev) => [newNotif, ...prev.slice(0, 9)]);
          setUnreadCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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
        return "📋";
      case "note":
        return "📝";
      case "reminder":
        return "⏰";
      default:
        return "🔔";
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
                className="relative text-muted-foreground hover:text-foreground hidden md:block"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0 dark-card">
              <div className="flex items-center justify-between p-4 border-b border-border/40">
                <h3 className="font-semibold">Notifications</h3>
                <div className="flex gap-1">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={markAllAsRead}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Mark all read
                    </Button>
                  )}
                  {notifications.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-muted-foreground"
                      onClick={clearAll}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors cursor-pointer",
                        !notification.is_read && "bg-primary/5"
                      )}
                      onClick={() => {
                        if (!notification.is_read) markAsRead(notification.id);
                      }}
                    >
                      <div className="flex gap-3">
                        <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={cn("text-sm font-medium truncate", !notification.is_read && "font-semibold")}>
                              {notification.title}
                            </p>
                            {!notification.is_read && (
                              <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-[10px] text-muted-foreground/60 mt-1">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </p>
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
