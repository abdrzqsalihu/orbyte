import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Automated cron job to check for tasks due today and trigger in-app notifications.
 * Triggered by Vercel Cron according to vercel.json schedule.
 */
export async function POST(request: Request) {
  // Verify secret from Vercel environment to prevent unauthorized pings
  const authHeader = request.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  // Fetch tasks due today that are not completed
  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select(`
      id,
      title,
      user_id,
      user_profiles:user_id (
        notifications_enabled,
        due_reminders_enabled
      )
    `)
    .eq("due_date", today)
    .neq("status", "done");

  if (tasksError) {
    console.error("[Cron] Error fetching tasks:", tasksError);
    return NextResponse.json({ error: tasksError.message }, { status: 500 });
  }

  if (!tasks || tasks.length === 0) {
    return NextResponse.json({ message: "No tasks due today" });
  }

  // Filter based on user preferences and prepare bulk insert
  const notificationsToInsert = tasks
    .filter((task: any) => {
      const prefs = task.user_profiles;
      return prefs?.notifications_enabled !== false && prefs?.due_reminders_enabled !== false;
    })
    .map((task: any) => ({
      user_id: task.user_id,
      title: "Task Due Today",
      message: `"${task.title}" is due today!`,
      type: "reminder",
      is_read: false,
    }));

  if (notificationsToInsert.length === 0) {
    return NextResponse.json({ message: "No notifications to send (disabled by users)" });
  }

  const { error: notifyError } = await supabase
    .from("notifications")
    .insert(notificationsToInsert);

  if (notifyError) {
    console.error("[Cron] Error creating notifications:", notifyError);
    return NextResponse.json({ error: notifyError.message }, { status: 500 });
  }

  return NextResponse.json({ 
    success: true, 
    count: notificationsToInsert.length 
  });
}
