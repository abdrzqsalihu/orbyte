export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: "todo" | "inprogress" | "done";
  priority: "low" | "medium" | "high";
  category: string;
  due_date: string | null;
  position: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  theme: "light" | "dark";
  accent_color: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
  notification_frequency: "realtime" | "hourly" | "daily" | "weekly";
  created_at: string;
  updated_at: string;
}
