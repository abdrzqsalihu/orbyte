import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OverviewDashboard } from "@/components/overview-dashboard";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tasks:", error);
  }

  return <OverviewDashboard initialTasks={tasks || []} userId={user.id} />;
}
