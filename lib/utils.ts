import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Task } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface Column {
  id: Task["status"];
  title: string;
  badge: string;
}

export const COLUMNS: Column[] = [
  { id: "todo", title: "To Do", badge: "Planned" },
  { id: "inprogress", title: "In Progress", badge: "Active" },
  { id: "done", title: "Done", badge: "Completed" },
];

export const getPriorityColor = (priority: string): string => {
  const priorityMap: Record<string, string> = {
    high: "bg-red-800 hover:bg-red-800",
    medium: "bg-amber-800 hover:bg-amber-800",
    low: "bg-slate-700 hover:bg-slate-700",
  };
  return priorityMap[priority] || "bg-slate-500";
};

export const getPriorityBarColor = (priority: string): string => {
  const colors: Record<string, string> = {
    high: "bg-red-800",
    medium: "bg-amber-800",
    low: "bg-slate-700",
  };
  return colors[priority] || "bg-slate-500";
};

export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "No due date";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const getColumnTitle = (statusId: string): string => {
  return COLUMNS.find((c) => c.id === statusId)?.badge || "";
};
