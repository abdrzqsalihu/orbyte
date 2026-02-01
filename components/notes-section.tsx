"use client"

import { useState } from "react"
import { PlusCircle, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { NoteModal } from "@/components/note-modal"
import type { Note } from "@/lib/types"

interface NotesSectionProps {
  notes: Note[]
}

export function NotesSection({ notes }: NotesSectionProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-white">Notes</h2>
        <div className="flex w-full sm:w-auto gap-3 flex-col sm:flex-row">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              className="pl-9 bg-secondary border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsNoteModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)] overflow-y-auto">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <Card key={note.id} className="h-fit bg-secondary border-border hover:bg-secondary/80 transition-colors">
              <CardHeader className="pb-2 flex justify-between items-start">
                <CardTitle className="text-lg">{note.title}</CardTitle>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 -mt-2 -mr-2">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{note.content}</p>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">Created on {note.createdAt}</CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center h-40">
            <p className="text-muted-foreground">No notes found. Create a new note to get started.</p>
          </div>
        )}
      </div>

      {isNoteModalOpen && <NoteModal onClose={() => setIsNoteModalOpen(false)} />}
    </div>
  )
}
