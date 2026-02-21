// app/dashboard/kanban/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { KanbanBoard } from "@/components/kanban-board";

export default async function KanbanPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching tasks:", error);
  }

  return <KanbanBoard initialTasks={tasks || []} userId={user.id} />;
}
