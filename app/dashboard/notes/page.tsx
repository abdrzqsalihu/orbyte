import { initialNotes } from "@/lib/data"
import { NotesSection } from "@/components/notes-section"

export default function NotesPage() {
  return <NotesSection notes={initialNotes} />
}
