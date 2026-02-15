"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { User, Bell, Moon, Sun, Palette, Zap } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";

export function SettingsView() {
  const { theme, setTheme, toggleTheme, accentColor, setAccentColor } =
    useTheme();
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [animationLevel, setAnimationLevel] = useState(80);

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
                Your account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value="user@example.com"
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
                    defaultValue="John Doe"
                    placeholder="Enter your full name"
                    className="dark-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself"
                  className="min-h-[100px] dark-input"
                  defaultValue=""
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button className="bg-primary hover:bg-primary/90">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="dark-card">
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of your TaskFlow interface
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

                <div className="space-y-2 hidden">
                  <div className="flex items-center justify-between">
                    <Label>Animation Level</Label>
                    <span className="text-sm text-muted-foreground">
                      {animationLevel}%
                    </span>
                  </div>
                  <Slider
                    value={[animationLevel]}
                    min={0}
                    max={100}
                    step={10}
                    onValueChange={(value) => setAnimationLevel(value[0])}
                  />
                  <p className="text-xs text-muted-foreground">
                    Adjust the amount of animations and transitions in the
                    interface
                  </p>
                </div>

                <div className="fle items-center space-x-2 hidden">
                  <Switch
                    id="compact-mode"
                    checked={compactMode}
                    onCheckedChange={setCompactMode}
                  />
                  <Label htmlFor="compact-mode">Compact Mode</Label>
                </div>
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
                <Select defaultValue="realtime">
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card className="dark-card">
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Configure advanced options for TaskFlow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto-Save</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save changes as you work
                  </p>
                </div>
                <Switch checked={autoSave} onCheckedChange={setAutoSave} />
              </div>

              <div className="space-y-2">
                <Label>Data Export</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Export all your tasks and notes data
                </p>
                <div className="flex space-x-2">
                  <Button variant="outline" className="dark-input">
                    Export as CSV
                  </Button>
                  <Button variant="outline" className="dark-input">
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
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
