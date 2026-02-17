"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Kanban,
  Calendar,
  FileText,
  Settings,
  Moon,
  Sun,
  LogOut,
  Zap,
  Menu,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    toast.loading("Logging out...");
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    toast.dismiss();
    toast.success("Logged out successfully");
    router.push("/login");
    router.refresh();
  };

  const getInitials = () => {
    const name = user?.user_metadata?.full_name || user?.user_metadata?.name;
    if (name)
      return name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    return user?.email?.slice(0, 2).toUpperCase() ?? "??";
  };

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Kanban", href: "/dashboard/kanban", icon: Kanban },
    { name: "Notes", href: "/dashboard/notes", icon: FileText },
    { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-background text-foreground px-4 py-8">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-2 mb-8">
        {/* <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground"> */}
        <Zap className="h-6 w-6 text-primary" />
        {/* </div> */}
        <span className="text-xl font-bold tracking-tight text-foreground">
          Orbyte
        </span>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 space-y-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 px-3 mb-4">
            Main Menu
          </p>
          <nav className="gap-1 flex flex-col">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                    active
                      ? "bg-secondary text-secondary-foreground font-semibold"
                      : "hover:bg-secondary/40 text-muted-foreground hover:text-foreground",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      active ? "text-primary" : "group-hover:text-primary",
                    )}
                  />
                  <span className="text-sm">{item.name}</span>
                  {active && (
                    <ChevronRight className="ml-auto h-4 w-4 opacity-40" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 px-3 mb-4">
            System
          </p>
          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
              pathname === "/dashboard/settings"
                ? "bg-secondary text-secondary-foreground font-semibold"
                : "hover:bg-secondary/40 text-muted-foreground hover:text-foreground",
            )}
          >
            <Settings className="h-5 w-5" />
            <span className="text-sm">Settings</span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto space-y-4">
        <div className="flex items-center justify-between px-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          >
            {theme === "dark" ? (
              <Moon className="h-4 w-4 transition-all" />
            ) : (
              <Sun className="h-4 w-4 transition-all" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-destructive/10 transition-all cursor-pointer hover:text-destructive"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        {/* User Card */}
        <div className="p-3 bg-secondary/30 rounded-xl border border-border/50 transition-colors hover:bg-secondary/40">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-background ring-1 ring-border/10 overflow-hidden">
              {/* 2. ADD THIS AvatarImage TAG HERE */}
              <AvatarImage
                src={
                  user?.user_metadata?.avatar_url ||
                  user?.user_metadata?.picture
                }
                alt={user?.user_metadata?.full_name || "User"}
              />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-black">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <p className="text-sm font-bold truncate leading-none">
                  {user?.user_metadata?.full_name ||
                    user?.user_metadata?.name ||
                    "User Account"}
                </p>
                <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
              </div>
              <p className="text-[11px] text-muted-foreground truncate font-medium">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-40">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-background border-border/50 shadow-none"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 w-80 border-none shadow-none"
          >
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      <aside className="hidden md:flex w-72 flex-col h-screen sticky top-0 border-r border-border/50 bg-background">
        <SidebarContent />
      </aside>
    </>
  );
}
