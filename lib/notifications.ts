import { createClient } from "@/lib/supabase/client";

export type NotificationType = "task" | "note" | "reminder" | "system";

export async function createNotification({
  userId,
  title,
  message,
  type = "system",
}: {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
}) {
  const supabase = createClient();
  
  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    title,
    message,
    type,
    is_read: false,
  });

  if (error) {
    console.error("Error creating notification:", error);
    return { success: false, error };
  }

  return { success: true };
}

/**
 * Checks for tasks due today and creates notifications for users who have them.
 * This should ideally be called from a server-side cron job.
 */
export async function checkAndNotifyDueTasks(supabaseAdmin: any) {
  const today = new Date().toISOString().split('T')[0];

  // Fetch tasks due today that haven't been completed
  const { data: tasks, error } = await supabaseAdmin
    .from("tasks")
    .select("id, title, user_id")
    .eq("due_date", today)
    .neq("status", "done");

  if (error) {
    console.error("Error fetching due tasks:", error);
    return;
  }

  if (!tasks || tasks.length === 0) return;

  // Manual Join for preferences
  const userIds = Array.from(new Set(tasks.map((t: any) => t.user_id)));
  const { data: profiles, error: profileError } = await supabaseAdmin
    .from("user_profiles")
    .select("id, notifications_enabled, due_reminders_enabled")
    .in("id", userIds);

  if (profileError) {
    console.error("Error fetching user profiles for due tasks:", profileError);
    return;
  }

  const profileMap = new Map(profiles.map((p: any) => [p.id, p]));

  for (const task of tasks) {
    const prefs: any = profileMap.get(task.user_id);
    // Only notify if user has notifications enabled AND due reminders enabled
    if (prefs?.notifications_enabled !== false && prefs?.due_reminders_enabled !== false) {
      await createNotification({
        userId: task.user_id,
        title: "Task Due Today",
        message: `"${task.title}" is due today!`,
        type: "reminder",
      });
    }
  }
}
