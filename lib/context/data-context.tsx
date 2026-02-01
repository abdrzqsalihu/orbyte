"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { initialTasks, initialNotes } from "@/lib/data"
import type { Task, Note } from "@/lib/types"

type DataContextType = {
  tasks: Task[]
  notes: Note[]
  addTask: (task: Omit<Task, "id">) => Task
  updateTask: (task: Task) => void
  deleteTask: (taskId: string) => void
  updateTaskStatus: (taskId: string, status: string) => void
  addNote: (note: Omit<Note, "id" | "createdAt">) => Note
  deleteNote: (noteId: string) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [notes, setNotes] = useState<Note[]>([])

  // Load initial data
  useEffect(() => {
    // Try to load from localStorage first
    const savedTasks = localStorage.getItem("tasks")
    const savedNotes = localStorage.getItem("notes")

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    } else {
      setTasks(initialTasks)
    }

    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    } else {
      setNotes(initialNotes)
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks))
    }
    if (notes.length > 0) {
      localStorage.setItem("notes", JSON.stringify(notes))
    }
  }, [tasks, notes])

  const addTask = (task: Omit<Task, "id">) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...task,
    }
    setTasks((prev) => [newTask, ...prev])
    return newTask
  }

  const updateTask = (task: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)))
  }

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const updateTaskStatus = (taskId: string, status: string) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status } : task)))
  }

  const addNote = (note: Omit<Note, "id" | "createdAt">) => {
    const newNote: Note = {
      id: Date.now().toString(),
      createdAt: new Date().toLocaleDateString(),
      ...note,
    }
    setNotes((prev) => [newNote, ...prev])
    return newNote
  }

  const deleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId))
  }

  return (
    <DataContext.Provider
      value={{
        tasks,
        notes,
        addTask,
        updateTask,
        deleteTask,
        updateTaskStatus,
        addNote,
        deleteNote,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
