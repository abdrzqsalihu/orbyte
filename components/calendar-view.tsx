"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskModal } from "@/components/task-modal";
import { createClient } from "@/lib/supabase/client";
import type { Task } from "@/lib/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CalendarViewProps {
  initialTasks: Task[];
  userId: string;
}

export function CalendarView({ initialTasks, userId }: CalendarViewProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      if (!task.due_date) return false;
      const taskDate = new Date(task.due_date);
      return isSameDay(date, taskDate);
    });
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

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
      toast.error("Failed to update task", { id: toastId }); // replace loading
      return;
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskData.id ? { ...task, ...updatePayload } : task,
      ),
    );

    toast.success("Task updated successfully", { id: toastId }); // replace loading
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-white">Calendar</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={previousMonth}
            className="border-border"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center px-4 py-1 rounded-md bg-secondary border border-border font-medium">
            {format(currentDate, "MMMM yyyy")}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={nextMonth}
            className="border-border"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center font-medium text-sm py-2 text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 md:gap-4">
        {monthDays.map((day, i) => {
          const dayTasks = getTasksForDate(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const hasHighPriority = dayTasks.some(
            (task) => task.priority === "high",
          );
          const hasMediumPriority = dayTasks.some(
            (task) => task.priority === "medium",
          );

          return (
            <Button
              key={i}
              variant="outline"
              className={`h-16 md:h-24 p-1 flex flex-col items-start justify-start bg-secondary border-border hover:bg-secondary/80 ${
                !isSameMonth(day, currentDate) ? "text-muted-foreground/50" : ""
              } ${
                isSelected
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : ""
              }`}
              onClick={() => setSelectedDate(day)}
            >
              <div className="w-full flex justify-between items-center mb-1">
                <span className="text-sm">{format(day, "d")}</span>
                {hasHighPriority && (
                  <span className="h-2 w-2 rounded-full bg-red-500"></span>
                )}
                {!hasHighPriority && hasMediumPriority && (
                  <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                )}
              </div>
              <div className="w-full overflow-hidden">
                {dayTasks.slice(0, 2).map((task) => (
                  <div
                    key={task.id}
                    className={`text-xs mb-1 truncate rounded px-1 py-0.5 ${
                      task.priority === "high"
                        ? "bg-red-500/20 text-red-400"
                        : task.priority === "medium"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {task.title}
                  </div>
                ))}
                {dayTasks.length > 2 && (
                  <div className="text-xs text-muted-foreground">
                    +{dayTasks.length - 2} more
                  </div>
                )}
              </div>
            </Button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="mt-6">
          <h3 className="font-medium mb-4 text-muted-foreground">
            Tasks for {format(selectedDate, "MMMM d, yyyy")}
          </h3>
          {selectedDateTasks.length > 0 ? (
            <div className="space-y-3">
              {selectedDateTasks.map((task) => (
                <Card
                  key={task.id}
                  className="cursor-pointer hover:bg-secondary/80 transition-colors bg-secondary border-border"
                  onClick={() => handleEditTask(task)}
                >
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {task.description || "No description"}
                      </div>
                    </div>
                    <Badge
                      className={
                        task.priority === "high"
                          ? "bg-red-500 text-white"
                          : task.priority === "medium"
                            ? "bg-amber-500 text-white"
                            : "bg-blue-500 text-white"
                      }
                    >
                      {task.priority}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No tasks for this date</p>
          )}
        </div>
      )}

      {isTaskModalOpen && (
        <TaskModal
          task={currentTask}
          onClose={() => {
            setIsTaskModalOpen(false);
            setCurrentTask(null);
          }}
          onSubmit={handleUpdateTask}
        />
      )}
    </div>
  );
}
