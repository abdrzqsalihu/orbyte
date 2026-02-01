"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { OverviewDashboard } from "@/components/overview-dashboard"
import { KanbanBoard } from "@/components/kanban-board"
import { NotesSection } from "@/components/notes-section"
import { CalendarView } from "@/components/calendar-view"
import { SettingsView } from "@/components/settings-view"
import { TaskModal } from "@/components/task-modal"
import { NoteModal } from "@/components/note-modal"
import { Notification } from "@/components/notification"
import { SeedDataButton } from "@/components/seed-data-button"
import { createTask, updateTask, deleteTask, updateTaskStatus } from "@/lib/actions/tasks"
import { createNote } from "@/lib/actions/notes"
import { useAuth } from "@/lib/auth/auth-context"
import type { Task, Note } from "@/lib/types"
import type { User } from "@supabase/supabase-js"

interface DashboardProps {
  initialTasks: Task[]
  initialNotes: Note[]
  user: User
}

export default function Dashboard({ initialTasks, initialNotes, user }: DashboardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [notifications, setNotifications] = useState<string[]>([])
  const [activeView, setActiveView] = useState("overview")
  const { signOut } = useAuth()

  const addTask = async (task: Task) => {
    if (currentTask) {
      // Update existing task
      const success = await updateTask(task)
      if (success) {
        setTasks(tasks.map((t) => (t.id === task.id ? task : t)))
        showNotification(`Task "${task.title}" updated successfully`)
      }
    } else {
      // Create new task
      const newTask = await createTask(task)
      if (newTask) {
        setTasks([newTask, ...tasks])
        showNotification(`Task "${task.title}" created successfully`)
      }
    }
    setIsTaskModalOpen(false)
    setCurrentTask(null)
  }

  const editTask = (task: Task) => {
    setCurrentTask(task)
    setIsTaskModalOpen(true)
  }

  const removeTask = async (taskId: string) => {
    const success = await deleteTask(taskId)
    if (success) {
      const taskToRemove = tasks.find((t) => t.id === taskId)
      setTasks(tasks.filter((task) => task.id !== taskId))
      if (taskToRemove) {
        showNotification(`Task "${taskToRemove.title}" deleted successfully`)
      }
    }
  }

  const updateStatus = async (taskId: string, newStatus: string) => {
    const success = await updateTaskStatus(taskId, newStatus)
    if (success) {
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
      const taskToUpdate = tasks.find((t) => t.id === taskId)
      if (taskToUpdate) {
        showNotification(
          `Task "${taskToUpdate.title}" moved to ${newStatus === "todo" ? "To Do" : newStatus === "inprogress" ? "In Progress" : "Done"}`,
        )
      }
    }
  }

  const addNote = async (note: Omit<Note, "id" | "createdAt">) => {
    const newNote = await createNote(note)
    if (newNote) {
      setNotes([newNote, ...notes])
      showNotification(`Note "${note.title}" created successfully`)
    }
    setIsNoteModalOpen(false)
  }

  const showNotification = (message: string) => {
    setNotifications([...notifications, message])
  }

  const dismissNotification = (index: number) => {
    setNotifications(notifications.filter((_, i) => i !== index))
  }

  const renderActiveView = () => {
    switch (activeView) {
      case "overview":
        return <OverviewDashboard tasks={tasks} onEditTask={editTask} />
      case "kanban":
        return (
          <KanbanBoard
            tasks={tasks}
            onAddTask={() => {
              setCurrentTask(null)
              setIsTaskModalOpen(true)
            }}
            onEditTask={editTask}
            onDeleteTask={removeTask}
            onUpdateTaskStatus={updateStatus}
          />
        )
      case "notes":
        return <NotesSection notes={notes} onAddNote={() => setIsNoteModalOpen(true)} />
      case "calendar":
        return <CalendarView tasks={tasks} onEditTask={editTask} />
      case "settings":
        return <SettingsView user={user} onSignOut={signOut} />
      default:
        return <OverviewDashboard tasks={tasks} onEditTask={editTask} />
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground grid-bg">
      <Sidebar activeView={activeView} setActiveView={setActiveView} user={user} onSignOut={signOut} />

      <main className="flex-1 overflow-auto p-4 md:p-6 pt-16 md:pt-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">TaskFlow</h1>
            <p className="text-muted-foreground">
              {activeView === "overview"
                ? "Dashboard Overview"
                : activeView === "kanban"
                  ? "Task Management"
                  : activeView === "notes"
                    ? "Notes & Documentation"
                    : activeView === "calendar"
                      ? "Calendar & Schedule"
                      : "Settings & Preferences"}
            </p>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mt-4 md:mt-0">
            {tasks.length === 0 && notes.length === 0 && <SeedDataButton />}
            {notifications.map((notification, index) => (
              <Notification key={index} message={notification} onDismiss={() => dismissNotification(index)} />
            ))}
          </div>
        </div>

        {renderActiveView()}

        {isTaskModalOpen && (
          <TaskModal
            task={currentTask}
            onSave={addTask}
            onCancel={() => {
              setIsTaskModalOpen(false)
              setCurrentTask(null)
            }}
          />
        )}

        {isNoteModalOpen && (
          <NoteModal
            onSave={addNote}
            onCancel={() => {
              setIsNoteModalOpen(false)
            }}
          />
        )}
      </main>
    </div>
  )
}
