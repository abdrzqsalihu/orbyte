import { Task } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Edit2, FolderOpen, X } from "lucide-react";
import { getPriorityColor, formatDate, getColumnTitle } from "@/lib/utils";

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
  onEdit: (task: Task) => void;
}

export const TaskDetails = ({ task, onClose, onEdit }: TaskDetailsProps) => (
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
          <h2 className="text-xl md:text-2xl font-bold break-words">{task.title}</h2>
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
          <h3 className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Description
          </h3>
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {task.description || "No description provided"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Due Date
            </h3>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              {formatDate(task.due_date)}
            </div>
          </div>
          <div>
            <h3 className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
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
);
