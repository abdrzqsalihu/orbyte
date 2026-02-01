"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const SidebarContent = () => (
    <>
      <div className="p-4 border-b border-border/40">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-md bg-accent flex items-center justify-center mr-2">
            <Kanban className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Orbyte</h1>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3">
        <nav className="space-y-1">
          <Button
            variant={isActive("/dashboard") ? "default" : "ghost"}
            className={`w-full justify-start ${
              isActive("/dashboard") ? "bg-accent" : ""
            }`}
            asChild
          >
            <Link href="/dashboard">
              <LayoutDashboard className="h-5 w-5 mr-3" />
              Dashboard
            </Link>
          </Button>

          <Button
            variant={isActive("/dashboard/kanban") ? "default" : "ghost"}
            className={`w-full justify-start ${
              isActive("/dashboard/kanban") ? "bg-accent" : ""
            }`}
            asChild
          >
            <Link href="/dashboard/kanban">
              <Kanban className="h-5 w-5 mr-3" />
              Kanban Board
            </Link>
          </Button>

          <Button
            variant={isActive("/dashboard/notes") ? "default" : "ghost"}
            className={`w-full justify-start ${
              isActive("/dashboard/notes") ? "bg-accent" : ""
            }`}
            asChild
          >
            <Link href="/dashboard/notes">
              <FileText className="h-5 w-5 mr-3" />
              Notes
            </Link>
          </Button>

          <Button
            variant={isActive("/dashboard/calendar") ? "default" : "ghost"}
            className={`w-full justify-start ${
              isActive("/dashboard/calendar") ? "bg-accent" : ""
            }`}
            asChild
          >
            <Link href="/dashboard/calendar">
              <Calendar className="h-5 w-5 mr-3" />
              Calendar
            </Link>
          </Button>

          <Button
            variant={isActive("/dashboard/settings") ? "default" : "ghost"}
            className={`w-full justify-start ${
              isActive("/dashboard/settings") ? "bg-accent" : ""
            }`}
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
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-8 w-8 ml-2 border-border/40 dark-input"
          >
            <Settings className="h-4 w-4" />
          </Button>
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
            <AvatarFallback className="bg-accent text-white">AS</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium">Abdulrazaq Salihu</p>
            <p className="text-xs text-muted-foreground">Software Developer</p>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );

  // Desktop sidebar
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
