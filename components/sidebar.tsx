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
  Bell,
  Menu,
  Moon,
  Sun,
  LogOut,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Get the current user on mount
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth state changes (e.g. session expiry)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh(); // Clear server-side session state
  };

  // Get initials from name or email
  const getInitials = () => {
    if (!user) return "?";
    const name = user.user_metadata?.full_name || user.user_metadata?.name;
    if (name) {
      return name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    // Fall back to first 2 chars of email
    return user.email?.slice(0, 2).toUpperCase() ?? "??";
  };

  const getDisplayName = () => {
    return (
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      // user?.email ||
      "User"
    );
  };

  const getDisplayEmail = () => {
    return user?.email || "";
  };

  const isActive = (path: string) => pathname === path;

  const SidebarContent = () => (
    <>
      <div className="p-4 border-b border-border/40">
        <div className="flex items-center">
          <Zap className="mr-2 h-7 w-7 text-primary" />
          <h1 className="text-xl font-medium text-white">Orbyte</h1>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3">
        <nav className="space-y-1">
          <Button
            variant={isActive("/dashboard") ? "default" : "ghost"}
            className={`w-full justify-start ${isActive("/dashboard") ? "bg-accent" : ""}`}
            asChild
          >
            <Link href="/dashboard">
              <LayoutDashboard className="h-5 w-5 mr-3" />
              Dashboard
            </Link>
          </Button>

          <Button
            variant={isActive("/dashboard/kanban") ? "default" : "ghost"}
            className={`w-full justify-start ${isActive("/dashboard/kanban") ? "bg-accent" : ""}`}
            asChild
          >
            <Link href="/dashboard/kanban">
              <Kanban className="h-5 w-5 mr-3" />
              Kanban Board
            </Link>
          </Button>

          <Button
            variant={isActive("/dashboard/notes") ? "default" : "ghost"}
            className={`w-full justify-start ${isActive("/dashboard/notes") ? "bg-accent" : ""}`}
            asChild
          >
            <Link href="/dashboard/notes">
              <FileText className="h-5 w-5 mr-3" />
              Notes
            </Link>
          </Button>

          <Button
            variant={isActive("/dashboard/calendar") ? "default" : "ghost"}
            className={`w-full justify-start ${isActive("/dashboard/calendar") ? "bg-accent" : ""}`}
            asChild
          >
            <Link href="/dashboard/calendar">
              <Calendar className="h-5 w-5 mr-3" />
              Calendar
            </Link>
          </Button>

          <Button
            variant={isActive("/dashboard/settings") ? "default" : "ghost"}
            className={`w-full justify-start ${isActive("/dashboard/settings") ? "bg-accent" : ""}`}
            asChild
          >
            <Link href="/dashboard/settings">
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </Link>
          </Button>
        </nav>
      </div>

      <div className="border-t border-border/40 p-4">
        <div className="flex items-center mb-4">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-8 w-8 border-border/40 dark-input"
          >
            <Bell className="h-4 w-4" />
          </Button>
          <Link
            href="/dashboard/settings"
            className="rounded-full flex items-center justify-center h-8 w-8 ml-2 border-border/40 dark-input hover:bg-primary"
          >
            <Settings className="h-4 w-4" />
          </Link>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-8 w-8 ml-2 border-border/40 dark-input"
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="flex items-center">
          <Avatar>
            <AvatarFallback className="bg-accent text-white">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3 min-w-0">
            <p className="text-sm font-medium truncate">{getDisplayName()}</p>
            <p className="text-xs text-muted-foreground truncate">
              {getDisplayEmail()}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto shrink-0"
            onClick={handleLogout}
            disabled={isLoggingOut}
            title="Log out"
          >
            <LogOut className={`h-4 w-4 ${isLoggingOut ? "opacity-50" : ""}`} />
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 deep-black">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex w-64 deep-black border-r border-border/40 flex-col h-full">
        <SidebarContent />
      </div>
    </>
  );
}
