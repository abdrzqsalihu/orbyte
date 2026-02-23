"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, LineChart, PieChart } from "@/components/ui/chart";
import {
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Calendar,
  CheckSquare,
  AlertCircle,
} from "lucide-react";
import { TaskModal } from "@/components/task-modal";
import { createClient } from "@/lib/supabase/client";
import type { Task } from "@/lib/types";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isWithinInterval,
  parseISO,
  subWeeks,
} from "date-fns";
import { toast } from "sonner";

interface OverviewDashboardProps {
  initialTasks: Task[];
  userId: string;
}

export function OverviewDashboard({
  initialTasks,
  userId,
}: OverviewDashboardProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [timeframe, setTimeframe] = useState("week");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const supabase = createClient();

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "inprogress",
  ).length;
  const todoTasks = tasks.filter((task) => task.status === "todo").length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate priority distribution
  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "high",
  ).length;
  const mediumPriorityTasks = tasks.filter(
    (task) => task.priority === "medium",
  ).length;
  const lowPriorityTasks = tasks.filter(
    (task) => task.priority === "low",
  ).length;

  // Get upcoming tasks (due in the next 7 days)
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const upcomingTasks = tasks
    .filter((task) => {
      if (!task.due_date) return false;
      const dueDate = new Date(task.due_date);
      return dueDate >= today && dueDate <= nextWeek && task.status !== "done";
    })
    .sort((a, b) => {
      if (!a.due_date || !b.due_date) return 0;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    })
    .slice(0, 5);

  // Calculate real chart data based on tasks
  const weeklyActivityData = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const completed = days.map((day) => {
      return tasks.filter((task) => {
        if (!task.completed_at) return false;
        const completedDate = parseISO(task.completed_at);
        return (
          format(completedDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
        );
      }).length;
    });

    const created = days.map((day) => {
      return tasks.filter((task) => {
        const createdDate = parseISO(task.created_at);
        return format(createdDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
      }).length;
    });

    return {
      labels: days.map((day) => format(day, "EEE")),
      completed,
      created,
    };
  }, [tasks]);

  // Calculate productivity trend (last 4 weeks)
  const productivityData = useMemo(() => {
    const weeks = [3, 2, 1, 0]; // Last 4 weeks
    const scores = weeks.map((weeksAgo) => {
      const weekStart = startOfWeek(subWeeks(new Date(), weeksAgo), {
        weekStartsOn: 0,
      });
      const weekEnd = endOfWeek(subWeeks(new Date(), weeksAgo), {
        weekStartsOn: 0,
      });

      const weekTasks = tasks.filter((task) => {
        const createdDate = parseISO(task.created_at);
        return isWithinInterval(createdDate, {
          start: weekStart,
          end: weekEnd,
        });
      });

      const weekCompleted = weekTasks.filter(
        (task) => task.status === "done",
      ).length;
      const score =
        weekTasks.length > 0
          ? Math.round((weekCompleted / weekTasks.length) * 100)
          : 0;

      return score;
    });

    return {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      scores,
    };
  }, [tasks]);

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

    // Track when task is completed
    if (taskData.status === "done" && currentTask?.status !== "done") {
      updatePayload.completed_at = new Date().toISOString();
    } else if (taskData.status !== "done" && currentTask?.status === "done") {
      updatePayload.completed_at = null;
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

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsTaskModalOpen(true);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Chart data using real calculations
  const taskCompletionData = {
    labels: weeklyActivityData.labels,
    datasets: [
      {
        label: "Completed",
        data: weeklyActivityData.completed,
        backgroundColor: "rgba(147, 51, 234, 0.8)",
        borderColor: "rgba(147, 51, 234, 1)",
        borderWidth: 2,
      },
      {
        label: "Created",
        data: weeklyActivityData.created,
        backgroundColor: "rgba(79, 70, 229, 0.8)",
        borderColor: "rgba(79, 70, 229, 1)",
        borderWidth: 2,
      },
    ],
  };

  const productivityTrendData = {
    labels: productivityData.labels,
    datasets: [
      {
        label: "Completion Rate %",
        data: productivityData.scores,
        borderColor: "rgba(236, 72, 153, 1)",
        backgroundColor: "rgba(236, 72, 153, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const priorityDistributionData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        label: "Tasks by Priority",
        data: [highPriorityTasks, mediumPriorityTasks, lowPriorityTasks],
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(16, 185, 129, 0.8)",
        ],
        borderColor: [
          "rgba(239, 68, 68, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(16, 185, 129, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="dark-card shadow-none border border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Tasks
                </p>
                <h3 className="text-2xl font-bold mt-1">{totalTasks}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                <CheckSquare className="h-6 w-6 text-accent" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge
                variant="outline"
                className="bg-accent/10 text-accent border-accent/30"
              >
                <ArrowUpRight className="mr-1 h-3 w-3" />
                Live data
              </Badge>
              <span className="ml-2 text-muted-foreground">from database</span>
            </div>
          </CardContent>
        </Card>

        <Card className="dark-card shadow-none border border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Completion Rate
                </p>
                <h3 className="text-2xl font-bold mt-1">{completionRate}%</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge
                variant="outline"
                className="bg-purple-500/10 text-purple-500 border-purple-500/30"
              >
                {completedTasks}/{totalTasks}
              </Badge>
              <span className="ml-2 text-muted-foreground">
                tasks completed
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="dark-card shadow-none border border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  In Progress
                </p>
                <h3 className="text-2xl font-bold mt-1">{inProgressTasks}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge
                variant="outline"
                className="bg-blue-500/10 text-blue-500 border-blue-500/30"
              >
                Active
              </Badge>
              <span className="ml-2 text-muted-foreground">working on now</span>
            </div>
          </CardContent>
        </Card>

        <Card className="dark-card shadow-none border border-border/40">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  High Priority
                </p>
                <h3 className="text-2xl font-bold mt-1">{highPriorityTasks}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Badge
                variant="outline"
                className="bg-red-500/10 text-red-500 border-red-500/30"
              >
                Urgent
              </Badge>
              <span className="ml-2 text-muted-foreground">
                needs attention
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 dark-card shadow-none border border-border/40">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-medium">
                  Task Activity
                </CardTitle>
                <CardDescription>
                  Tasks created vs completed this week
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[300px]">
              <BarChart
                data={taskCompletionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: "rgba(255, 255, 255, 0.1)",
                      },
                      ticks: {
                        color: "rgba(255, 255, 255, 0.7)",
                        stepSize: 1,
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                      ticks: {
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      position: "top",
                      labels: {
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="dark-card shadow-none border border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Priority Distribution
            </CardTitle>
            <CardDescription>Current task breakdown</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[300px]">
              <PieChart
                data={priorityDistributionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Productivity Trend & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 dark-card shadow-none border border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Completion Rate Trend
            </CardTitle>
            <CardDescription>
              Weekly completion percentage (last 4 weeks)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[250px]">
              <LineChart
                data={productivityTrendData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      grid: {
                        color: "rgba(255, 255, 255, 0.1)",
                      },
                      ticks: {
                        color: "rgba(255, 255, 255, 0.7)",
                        callback: (value: string) => value + "%",
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                      ticks: {
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="dark-card shadow-none border border-border/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Upcoming Deadlines
            </CardTitle>
            <CardDescription>Tasks due in next 7 days</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center p-3 rounded-lg bg-secondary/40 hover:bg-secondary/60 transition-colors cursor-pointer border border-border/40"
                    onClick={() => handleEditTask(task)}
                  >
                    <div className="mr-3">
                      {task.priority === "high" ? (
                        <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        </div>
                      ) : task.priority === "medium" ? (
                        <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-amber-500" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(task.due_date)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  No upcoming deadlines
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

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
