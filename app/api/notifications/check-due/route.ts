import { createAdminClient } from "@/lib/supabase/admin";
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

  // Use Admin Client to bypass RLS for the cron job
  const supabase = createAdminClient();
  
  // Get date in YYYY-MM-DD format based on UTC
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  console.log(`[Cron] Running check for: ${today}`);

  // Fetch tasks due today that are not completed
  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select(`id, title, user_id, due_date, status`)
    .eq("due_date", today)
    .neq("status", "done");

  if (tasksError) {
    console.error("[Cron] Error fetching tasks:", tasksError);
    return NextResponse.json({ error: tasksError.message }, { status: 500 });
  }

  if (!tasks || tasks.length === 0) {
    // Debug: Fetch a few tasks to see what's in the DB
    const { data: recentTasks } = await supabase.from("tasks").select("title, due_date").limit(3);
    console.log("[Cron] No tasks due today. Recent tasks in DB:", recentTasks);
    
    return NextResponse.json({ 
      message: "No tasks due today",
      checkedDate: today,
      sampleTasks: recentTasks
    });
  }

  // Manual Join: Get unique user IDs and fetch their preferences separately
  // This bypasses the foreign key relationship requirement in Supabase select()
  const userIds = Array.from(new Set(tasks.map((t: any) => t.user_id)));
  const { data: profiles, error: profilesError } = await supabase
    .from("user_profiles")
    .select("id, notifications_enabled, due_reminders_enabled")
    .in("id", userIds);

  if (profilesError) {
    console.error("[Cron] Error fetching user profiles:", profilesError);
    return NextResponse.json({ error: profilesError.message }, { status: 500 });
  }

  // Create a map for quick lookup
  const profileMap = new Map(profiles.map((p: any) => [p.id, p]));

  // Filter based on user preferences and prepare bulk insert
  const notificationsToInsert = tasks
    .filter((task: any) => {
      const prefs: any = profileMap.get(task.user_id);
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
