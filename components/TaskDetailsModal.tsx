import { Task } from "@/lib/types";
import { TaskDetails } from "./TaskDetails";

interface TaskDetailsModalProps {
    task: Task;
    onClose: () => void;
    onEdit: (task: Task) => void;
}

export const TaskDetailsModal = ({ task, onClose, onEdit }: TaskDetailsModalProps) => (
    <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        onClick={onClose}
    >
        <TaskDetails task={task} onClose={onClose} onEdit={onEdit} />
    </div>
);