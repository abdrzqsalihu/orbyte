import { initialTasks } from "@/lib/data"
import { KanbanBoard } from "@/components/kanban-board"

export default function KanbanPage() {
  return <KanbanBoard tasks={initialTasks} />
}
