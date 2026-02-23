"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Bell, Moon, Sun, Palette, Zap, Loader2 } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { createClient } from "@/lib/supabase/client";
import type { UserProfile } from "@/lib/types";
import { useRouter } from "next/navigation";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { toast } from "sonner";

interface SettingsViewProps {
  user: SupabaseUser;
  initialProfile: UserProfile | null;
}

export function SettingsView({ user, initialProfile }: SettingsViewProps) {
  const { theme, setTheme, accentColor, setAccentColor } = useTheme();
  const supabase = createClient();
  const router = useRouter();
  const [fullName, setFullName] = useState(initialProfile?.full_name || "");
  const [notifications, setNotifications] = useState(
    initialProfile?.notifications_enabled ?? true,
  );
  const [emailNotifications, setEmailNotifications] = useState(
    initialProfile?.email_notifications ?? true,
  );
  const [notificationFrequency, setNotificationFrequency] = useState<
    "realtime" | "hourly" | "daily" | "weekly"
  >(initialProfile?.notification_frequency || "realtime");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);

    const { error } = await supabase.from("user_profiles").upsert({
      id: user.id,
      full_name: fullName,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    } else {
      toast.success("Profile saved successfully!");
    }

    setIsSavingProfile(false);
    router.refresh();
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }

    setIsUpdatingPassword(true);

    // First, verify the current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    });

    if (signInError) {
      toast.error("Current password is incorrect");
      setIsUpdatingPassword(false);
      return;
    }

    // If verification successful, update to new password
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
    } else {
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }

    setIsUpdatingPassword(false);
  };

  const handleSavePreferences = async () => {
    setIsSavingPreferences(true);

    const { error } = await supabase.from("user_profiles").upsert({
      id: user.id,
      theme: theme,
      accent_color: accentColor,
      notifications_enabled: notifications,
      email_notifications: emailNotifications,
      notification_frequency: notificationFrequency,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save preferences");
    } else {
      toast.success("Preferences saved successfully!");
    }

    setIsSavingPreferences(false);
  };

  const handleExportData = async (format: "csv" | "json") => {
    // Fetch all user data
    const { data: tasks } = await supabase.from("tasks").select("*");
    const { data: notes } = await supabase.from("notes").select("*");

    const exportData = {
      tasks: tasks || [],
      notes: notes || [],
      exportedAt: new Date().toISOString(),
    };

    if (format === "json") {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orbyte-export-${Date.now()}.json`;
      a.click();
      toast.success("Data exported successfully!");
    } else {
      // CSV export for tasks
      const csv = [
        [
          "Title",
          "Status",
          "Priority",
          "Category",
          "Due Date",
          "Created At",
        ].join(","),
        ...(tasks || []).map((task) =>
          [
            `"${task.title.replace(/"/g, '""')}"`,
            task.status,
            task.priority,
            task.category,
            task.due_date || "",
            task.created_at,
          ].join(","),
        ),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orbyte-tasks-${Date.now()}.csv`;
      a.click();
      toast.success("Tasks exported successfully!");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      "Are you absolutely sure? This action cannot be undone. All your data will be permanently deleted.",
    );

    if (!confirmed) return;

    const text = prompt('Type "DELETE" to confirm account deletion:');
    if (text !== "DELETE") {
      toast.error("Account deletion cancelled");
      return;
    }

    try {
      // Sign out (which will trigger cascading deletes via RLS policies)
      await supabase.auth.signOut();
      toast.success("Account deleted successfully");
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account. Please contact support.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Settings</h2>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="account">
            <User className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <Zap className="h-4 w-4 mr-2" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <Card className="dark-card">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Your account details and security settings
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Account Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user.email}
                    disabled
                    className="dark-input"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your email address is used for login and notifications
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="dark-input"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSaveProfile}
                  disabled={isSavingProfile}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Profile"
                  )}
                </Button>
              </div>

              {/* Password Update Section */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-semibold">Change Password</h3>

                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="dark-input"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="dark-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="dark-input"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleUpdatePassword}
                    disabled={
                      isUpdatingPassword ||
                      !currentPassword ||
                      !newPassword ||
                      !confirmPassword
                    }
                    variant="outline"
                    className="dark-input"
                  >
                    {isUpdatingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="dark-card">
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of your Orbyte interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle between light and dark themes
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4 text-muted-foreground" />
                    <Switch
                      checked={theme === "dark"}
                      onCheckedChange={(checked) =>
                        setTheme(checked ? "dark" : "light")
                      }
                    />
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <Select value={accentColor} onValueChange={setAccentColor}>
                    <SelectTrigger className="dark-input">
                      <SelectValue placeholder="Select accent color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="cyan">Cyan</SelectItem>
                      <SelectItem value="pink">Pink</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSavePreferences}
                  disabled={isSavingPreferences}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSavingPreferences ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Appearance"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="dark-card">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Control how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications in the app
                  </p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="space-y-2">
                <Label>Notification Frequency</Label>
                <Select
                  value={notificationFrequency}
                  onValueChange={(value: any) =>
                    setNotificationFrequency(value)
                  }
                >
                  <SelectTrigger className="dark-input">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="hourly">Hourly Digest</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Digest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSavePreferences}
                  disabled={isSavingPreferences}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSavingPreferences ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Notifications"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card className="dark-card">
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Configure advanced options for Orbyte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Data Export</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Export all your tasks and notes data
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="dark-input"
                    onClick={() => handleExportData("csv")}
                  >
                    Export as CSV
                  </Button>
                  <Button
                    variant="outline"
                    className="dark-input"
                    onClick={() => handleExportData("json")}
                  >
                    Export as JSON
                  </Button>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-border/40">
                <h3 className="text-sm font-medium text-red-500">
                  Danger Zone
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Permanently delete your account and all associated data
                </p>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
