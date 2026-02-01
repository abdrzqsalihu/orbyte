"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Database } from "lucide-react"
import { initialTasks, initialNotes } from "@/lib/data"
import { useData } from "@/lib/context/data-context"

export function SeedDataButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { tasks, notes } = useData()

  const handleSeed = async () => {
    setIsLoading(true)
    try {
      // Store initial data in localStorage
      localStorage.setItem("tasks", JSON.stringify(initialTasks))
      localStorage.setItem("notes", JSON.stringify(initialNotes))

      // Reload the page to refresh the data
      window.location.reload()
    } catch (error) {
      console.error("Error seeding data:", error)
      alert("An error occurred while adding sample data")
    } finally {
      setIsLoading(false)
    }
  }

  // Only show the button if there are no tasks or notes
  if (tasks.length > 0 || notes.length > 0) {
    return null
  }

  return (
    <Button onClick={handleSeed} disabled={isLoading} className="bg-primary hover:bg-primary/90">
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
      Add Sample Data
    </Button>
  )
}
