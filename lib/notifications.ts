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
    .select("*, user_profiles(notifications_enabled)")
    .eq("due_date", today)
    .neq("status", "done");

  if (error) {
    console.error("Error fetching due tasks:", error);
    return;
  }

  for (const task of tasks) {
    // Only notify if user has notifications enabled
    if (task.user_profiles?.notifications_enabled) {
      await createNotification({
        userId: task.user_id,
        title: "Task Due Today",
        message: `"${task.title}" is due today!`,
        type: "reminder",
      });
    }
  }
}
