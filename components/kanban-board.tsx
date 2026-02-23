"use client";

import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import {
  PlusCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Clock,
  Tag,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { TaskModal } from "@/components/task-modal";
import { createClient } from "@/lib/supabase/client";
import type { Task } from "@/lib/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface KanbanBoardProps {
  initialTasks: Task[];
  userId: string;
}

export function KanbanBoard({ initialTasks, userId }: KanbanBoardProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const columns = [
    { id: "todo", title: "To Do", badge: "Planned" },
    { id: "inprogress", title: "In Progress", badge: "Active" },
    { id: "done", title: "Done", badge: "Completed" },
  ];

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as Task["status"];
    const taskId = draggableId;

    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? { ...task, status: newStatus, position: destination.index }
        : task,
    );
    setTasks(updatedTasks);

    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus, position: destination.index })
      .eq("id", taskId);

    if (error) {
      console.error("Error updating task:", error);
      setTasks(tasks);
      alert("Failed to move task");
    } else {
      router.refresh();
    }
  };

  const handleCreateTask = async (
    taskData: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">,
  ) => {
    setIsTaskModalOpen(false);

    const toastId = toast.loading("Creating task...");

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        user_id: userId,
        ...taskData,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task", { id: toastId });
      return;
    }

    if (data) {
      setTasks((prev) => [...prev, data]);
      toast.success("Task created successfully", { id: toastId });
    }
  };

  const handleUpdateTask = async (taskData: any) => {
    setIsTaskModalOpen(false);

    const toastId = toast.loading("Updating task...");

    const updatePayload: any = {
      title: taskData.title,
      status: taskData.status,
      category: taskData.category,
    };

    if (taskData.description !== null && taskData.description !== undefined) {
      updatePayload.description = taskData.description;
    }

    if (taskData.priority) {
      updatePayload.priority = taskData.priority;
    }

    if (taskData.due_date !== null && taskData.due_date !== undefined) {
      updatePayload.due_date = taskData.due_date;
    }

    const { error } = await supabase
      .from("tasks")
      .update(updatePayload)
      .eq("id", taskData.id);

    if (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task", { id: toastId });
      return;
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskData.id ? { ...task, ...updatePayload } : task,
      ),
    );

    toast.success("Task updated successfully", { id: toastId });
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    setDeletingId(taskId);

    const toastId = toast.loading("Deleting task...");

    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task", { id: toastId });
      setDeletingId(null);
      return;
    }

    setTasks((prev) => prev.filter((task) => task.id !== taskId));

    toast.success("Task deleted successfully", { id: toastId });
    setDeletingId(null);
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsTaskModalOpen(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-amber-500 text-white";
      case "low":
        return "bg-blue-500 text-white";
      default:
        return "bg-slate-500 text-white";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Tasks</h2>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={() => {
            setCurrentTask(null);
            setIsTaskModalOpen(true);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex flex-col dark-card bg-card rounded-xl border border-border/50"
            >
              <h3 className="font-medium text-sm p-4 border-b border-border flex items-center justify-between">
                {column.title} (
                {tasks.filter((task) => task.status === column.id).length})
                <Badge variant="outline" className="bg-secondary/50 text-xs">
                  {column.badge}
                </Badge>
              </h3>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-1 overflow-y-auto p-3"
                  >
                    {tasks
                      .filter((task) => task.status === column.id)
                      .map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-3 bg-secondary/60 border-border/50 hover:bg-secondary/70 transition-colors shadow-none"
                            >
                              <CardHeader className="p-3 pb-0 flex justify-between items-start">
                                <div>
                                  <Badge
                                    className={`mb-2 ${getPriorityColor(task.priority)}`}
                                  >
                                    {task.priority.charAt(0).toUpperCase() +
                                      task.priority.slice(1)}
                                  </Badge>
                                  <h4 className="font-medium">{task.title}</h4>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => handleEditTask(task)}
                                    >
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteTask(task.id)}
                                      disabled={deletingId === task.id}
                                    >
                                      {deletingId === task.id ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Deleting...
                                        </>
                                      ) : (
                                        <>
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          Delete
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </CardHeader>
                              <CardContent className="p-3 pt-2">
                                <p className="text-sm text-muted-foreground">
                                  {task.description || "No description"}
                                </p>
                              </CardContent>
                              <CardFooter className="p-3 pt-0 flex justify-between">
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Clock className="mr-1 h-3 w-3" />
                                  {formatDate(task.due_date)}
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
            setIsTaskModalOpen(false);
            setCurrentTask(null);
          }}
          onSubmit={currentTask ? handleUpdateTask : handleCreateTask}
        />
      )}
    </div>
  );
}
