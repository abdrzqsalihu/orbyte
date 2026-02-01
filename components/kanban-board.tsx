"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "react-beautiful-dnd"
import { PlusCircle, MoreHorizontal, Edit, Trash2, Clock, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { TaskModal } from "@/components/task-modal"
import type { Task } from "@/lib/types"

interface KanbanBoardProps {
  tasks: Task[]
}

export function KanbanBoard({ tasks }: KanbanBoardProps) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)

  const columns = [
    { id: "todo", title: "To Do" },
    { id: "inprogress", title: "In Progress" },
    { id: "done", title: "Done" },
  ]

  const onDragEnd = (result: DropResult) => {
    // This is a static demo, so we don't actually update the tasks
    console.log("Task moved:", result)
  }

  const handleEditTask = (task: Task) => {
    setCurrentTask(task)
    setIsTaskModalOpen(true)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500 text-white"
      case "medium":
        return "bg-amber-500 text-white"
      case "low":
        return "bg-blue-500 text-white"
      default:
        return "bg-slate-500 text-white"
    }
  }

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Tasks</h2>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={() => {
            setCurrentTask(null)
            setIsTaskModalOpen(true)
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col dark-card rounded-xl border border-border">
              <h3 className="font-medium text-sm p-4 border-b border-border flex items-center justify-between">
                {column.title} ({tasks.filter((task) => task.status === column.id).length})
                <Badge variant="outline" className="bg-secondary text-xs">
                  {column.id === "todo" ? "Planned" : column.id === "inprogress" ? "Active" : "Completed"}
                </Badge>
              </h3>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="flex-1 overflow-y-auto p-3">
                    {tasks
                      .filter((task) => task.status === column.id)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-3 bg-secondary border-border hover:bg-secondary/80 transition-colors"
                            >
                              <CardHeader className="p-3 pb-0 flex justify-between items-start">
                                <div>
                                  <Badge className={`mb-2 ${getPriorityColor(task.priority)}`}>
                                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                  </Badge>
                                  <h4 className="font-medium">{task.title}</h4>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEditTask(task)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </CardHeader>
                              <CardContent className="p-3 pt-2">
                                <p className="text-sm text-muted-foreground">{task.description}</p>
                              </CardContent>
                              <CardFooter className="p-3 pt-0 flex justify-between">
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Clock className="mr-1 h-3 w-3" />
                                  {task.dueDate}
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Tag className="mr-1 h-3 w-3" />
                                  {task.category}
                                </div>
                              </CardFooter>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {isTaskModalOpen && (
        <TaskModal
          task={currentTask}
          onClose={() => {
            setIsTaskModalOpen(false)
            setCurrentTask(null)
          }}
        />
      )}
    </div>
  )
}
