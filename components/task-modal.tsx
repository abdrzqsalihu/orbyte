"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Task } from "@/lib/types";

interface TaskModalProps {
  task: Task | null;
  onClose: () => void;
  onSubmit: (taskData: any) => Promise<void>;
}

export function TaskModal({ task, onClose, onSubmit }: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [category, setCategory] = useState("work");
  const [status, setStatus] = useState<"todo" | "inprogress" | "done">("todo");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setDueDate(task.due_date || "");
      setPriority(task.priority || "medium");
      setCategory(task.category || "work");
      setStatus(task.status || "todo");
    } else {
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("medium");
      setCategory("work");
      setStatus("todo");
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const taskData = {
      ...(task ? { id: task.id, position: task.position } : { position: 0 }),
      title,
      description: description || null,
      due_date: dueDate || null,
      priority,
      category,
      status,
    };

    // console.log("Submitting task data:", taskData);
    // console.log(
    //   "Priority:",
    //   priority,
    //   "Status:",
    //   status,
    //   "Category:",
    //   category,
    // );

    await onSubmit(taskData);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="deep-black rounded-xl w-full max-w-md p-6 relative border border-border/40 max-h-[90vh] overflow-y-auto">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={onClose}
          disabled={isSubmitting}
        >
          <X className="h-4 w-4" />
        </Button>

        <h2 className="text-xl font-semibold mb-6 text-foreground">
          {task ? "Edit Task" : "Create New Task"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-muted-foreground">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              required
              disabled={isSubmitting}
              className="dark-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-muted-foreground">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              disabled={isSubmitting}
              className="min-h-[100px] dark-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">
                Due Date
              </label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isSubmitting}
                className="dark-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">
                Priority
              </label>
              <Select
                key={`priority-${priority}`}
                value={priority}
                onValueChange={(value: "low" | "medium" | "high") =>
                  setPriority(value)
                }
                disabled={isSubmitting}
              >
                <SelectTrigger className="dark-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">
                Category
              </label>
              <Select
                key={`category-${category}`}
                value={category}
                onValueChange={setCategory}
                disabled={isSubmitting}
              >
                <SelectTrigger className="dark-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">
                Status
              </label>
              <Select
                key={`status-${status}`}
                value={status}
                onValueChange={(value: "todo" | "inprogress" | "done") =>
                  setStatus(value)
                }
                disabled={isSubmitting}
              >
                <SelectTrigger className="dark-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="inprogress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-border/40 dark-input"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 dark-glow"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {task ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{task ? "Update Task" : "Create Task"}</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
