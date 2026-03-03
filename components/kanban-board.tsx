"use client";

import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import {
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Calendar,
  FolderOpen,
  Loader2,
  X,
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

// TYPES & CONSTANTS
interface KanbanBoardProps {
  initialTasks: Task[];
  userId: string;
}

interface Column {
  id: Task["status"];
  title: string;
  badge: string;
}

const COLUMNS: Column[] = [
  { id: "todo", title: "To Do", badge: "Planned" },
  { id: "inprogress", title: "In Progress", badge: "Active" },
  { id: "done", title: "Done", badge: "Completed" },
];

// UTILITIES
const getPriorityColor = (priority: string): string => {
  const priorityMap: Record<string, string> = {
    high: "bg-red-500 text-white",
    medium: "bg-amber-500 text-white",
    low: "bg-blue-500 text-white",
  };
  return priorityMap[priority] || "bg-slate-500 text-white";
};

const getPriorityBarColor = (priority: string): string => {
  const colors: Record<string, string> = {
    high: "bg-red-500",
    medium: "bg-amber-500",
    low: "bg-blue-500",
  };
  return colors[priority] || "bg-slate-500";
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return "No due date";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const getColumnTitle = (statusId: string): string => {
  return COLUMNS.find((c) => c.id === statusId)?.badge || "";
};

// CUSTOM HOOKS
const useTaskOperations = (
  initialTasks: Task[],
  userId: string,
  router: any,
) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const supabase = createClient();

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as Task["status"];
    const updatedTasks = tasks.map((task) =>
      task.id === draggableId
        ? { ...task, status: newStatus, position: destination.index }
        : task,
    );
    setTasks(updatedTasks);

    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus, position: destination.index })
      .eq("id", draggableId);

    if (error) {
      setTasks(tasks);
      toast.error("Failed to move task");
    } else {
      router.refresh();
    }
  };

  const handleCreate = async (
    taskData: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">,
  ) => {
    const toastId = toast.loading("Creating task...");
    const { data, error } = await supabase
      .from("tasks")
      .insert({ user_id: userId, ...taskData })
      .select()
      .single();

    if (error) {
      toast.error("Failed to create task", { id: toastId });
      return;
    }

    if (data) {
      setTasks((prev) => [...prev, data]);
      toast.success("Task created", { id: toastId });
    }
  };

  const handleUpdate = async (taskData: any): Promise<void> => {
    const toastId = toast.loading("Updating task...");
    const updatePayload: Record<string, any> = {
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
      toast.error("Failed to update task", { id: toastId });
      return;
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskData.id ? { ...task, ...updatePayload } : task,
      ),
    );

    toast.success("Task updated", { id: toastId });
  };

  const handleDelete = async (taskId: string): Promise<void> => {
    if (!confirm("Delete this task?")) return;
    setDeletingId(taskId);
    const toastId = toast.loading("Deleting task...");

    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) {
      toast.error("Failed to delete task", { id: toastId });
      setDeletingId(null);
      return;
    }

    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    toast.success("Task deleted", { id: toastId });
    setDeletingId(null);
  };

  return {
    tasks,
    deletingId,
    handleDragEnd,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
};

// SUB-COMPONENTS
interface TaskCardProps {
  task: Task;
  index: number;
  deletingId: string | null;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => Promise<void>;
  onView: (task: Task) => void;
}

const TaskCard = ({
  task,
  index,
  deletingId,
  onEdit,
  onDelete,
  onView,
}: TaskCardProps) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-3"
        >
          <Card
            onClick={() => onView(task)}
            className={`
              relative overflow-hidden border transition-all duration-200 cursor-pointer
              bg-secondary/60 border-border/50
              hover:bg-secondary/70 hover:border-primary/50
              ${snapshot.isDragging ? "scale-105" : ""}
              group
            `}
          >
            <div
              className={`absolute left-0 top-0 w-1 h-full ${getPriorityBarColor(task.priority)}`}
            />
            <div className="pl-3 pt-3 pr-3 pb-2">
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge
                  className={`${getPriorityColor(task.priority)} text-[10px] py-0 md:px-2 md:text-xs flex-shrink-0`}
                >
                  {task.priority.charAt(0).toUpperCase() +
                    task.priority.slice(1)}
                </Badge>
                <TaskMenu
                  task={task}
                  deletingId={deletingId}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </div>

              <h4 className="font-semibold text-sm leading-snug line-clamp-2 mb-2">
                {task.title}
              </h4>

              <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                {task.description || "No description"}
              </p>

              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground min-w-0 flex-1">
                  <Calendar className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{formatDate(task.due_date)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground flex-shrink-0">
                  <FolderOpen className="w-3 h-3" />
                  <span className="text-xs font-medium">{task.category}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

interface TaskMenuProps {
  task: Task;
  deletingId: string | null;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => Promise<void>;
}

const TaskMenu = ({ task, deletingId, onEdit, onDelete }: TaskMenuProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <MoreVertical className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-32">
      <DropdownMenuItem
        onClick={(e) => {
          e.stopPropagation();
          onEdit(task);
        }}
        className="cursor-pointer"
      >
        <Edit2 className="mr-2 h-3.5 w-3.5" />
        <span className="text-sm">Edit</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        disabled={deletingId === task.id}
        className="cursor-pointer"
      >
        {deletingId === task.id ? (
          <>
            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            <span className="text-sm">Deleting...</span>
          </>
        ) : (
          <>
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            <span className="text-sm">Delete</span>
          </>
        )}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

interface ColumnProps {
  column: Column;
  tasks: Task[];
  deletingId: string | null;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => Promise<void>;
  onViewTask: (task: Task) => void;
}

const KanbanColumn = ({
  column,
  tasks,
  deletingId,
  onEditTask,
  onDeleteTask,
  onViewTask,
}: ColumnProps) => {
  const columnTasks = tasks.filter((task) => task.status === column.id);

  return (
    <div className="flex flex-col h-full dark-card bg-card rounded-lg border border-border/50 overflow-hidden">
      <div className="flex-shrink-0 px-4 py-3.5 border-b border-border/50">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{column.title}</h3>
            <Badge
              variant="outline"
              className="bg-secondary/50 text-[10px] py-0 md:text-xs flex-shrink-0"
            >
              {columnTasks.length}
            </Badge>
          </div>
          <Badge
            variant="outline"
            className="bg-secondary/50 text-xs flex-shrink-0"
          >
            {column.badge}
          </Badge>
        </div>
      </div>

      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 overflow-y-auto px-3 py-3"
          >
            {columnTasks.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-center">
                <p className="text-xs text-muted-foreground font-medium">
                  No tasks yet
                </p>
              </div>
            ) : (
              columnTasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  deletingId={deletingId}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onView={onViewTask}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

interface TaskDetailsModalProps {
  task: Task;
  onClose: () => void;
  onEdit: (task: Task) => void;
}

const TaskDetailsModal = ({ task, onClose, onEdit }: TaskDetailsModalProps) => (
  <div
    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <Card
      className="w-full max-w-3xl max-h-[90vh] overflow-hidden bg-card border-border/50 flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      <CardHeader className="px-6 py-5 border-b border-border/50">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
              <Badge variant="outline" className="bg-secondary/50 text-xs">
                {getColumnTitle(task.status)}
              </Badge>
            </div>
            <h2 className="text-2xl font-bold break-words">{task.title}</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 flex-shrink-0"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Description
            </h3>
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {task.description || "No description provided"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Due Date
              </h3>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                {formatDate(task.due_date)}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                Category
              </h3>
              <div className="flex items-center gap-2 text-sm">
                <FolderOpen className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                {task.category}
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-border/50 px-6 py-4 flex gap-3 justify-end">
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
        <Button
          className="bg-primary hover:bg-primary/90"
          size="sm"
          onClick={() => {
            onEdit(task);
            onClose();
          }}
        >
          <Edit2 className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  </div>
);

export function KanbanBoard({ initialTasks, userId }: KanbanBoardProps) {
  const router = useRouter();
  const {
    tasks,
    deletingId,
    handleDragEnd,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useTaskOperations(initialTasks, userId, router);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [fullViewTask, setFullViewTask] = useState<Task | null>(null);

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCreateClick = () => {
    setCurrentTask(null);
    setIsTaskModalOpen(true);
  };

  const handleModalSubmit = async (taskData: any): Promise<void> => {
    setIsTaskModalOpen(false);
    currentTask ? await handleUpdate(taskData) : await handleCreate(taskData);
    setCurrentTask(null);
  };

  const handleCloseModal = () => {
    setIsTaskModalOpen(false);
    setCurrentTask(null);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 px-2 py-5 border-b border-border/50">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base md:text-xl font-bold">Tasks</h2>
            <p className="text-xs text-muted-foreground mt-1">
              {tasks.length} total {tasks.length === 1 ? "task" : "tasks"}
            </p>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90 text-xs md:text-sm"
            onClick={handleCreateClick}
          >
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full p-2 auto-rows-max md:auto-rows-fr">
            {COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={tasks}
                deletingId={deletingId}
                onEditTask={handleEditTask}
                onDeleteTask={handleDelete}
                onViewTask={setFullViewTask}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      {fullViewTask && (
        <TaskDetailsModal
          task={fullViewTask}
          onClose={() => setFullViewTask(null)}
          onEdit={handleEditTask}
        />
      )}

      {isTaskModalOpen && (
        <TaskModal
          task={currentTask}
          onClose={handleCloseModal}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}
