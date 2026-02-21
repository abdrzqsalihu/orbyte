// app/dashboard/notes/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NotesSection } from "@/components/notes-section";

export default async function NotesPage() {
  const supabase = await createClient();
  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch notes
  const { data: notes, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching notes:", error);
  }

  return <NotesSection initialNotes={notes || []} userId={user.id} />;
}
