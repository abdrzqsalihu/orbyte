"use client";

import type React from "react";
import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface NoteModalProps {
  onClose: () => void;
  onSubmit: (title: string, content: string) => Promise<void>;
}

export function NoteModal({ onClose, onSubmit }: NoteModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(title, content);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="deep-black rounded-xl w-full max-w-md p-6 relative border border-border/40">
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
          Create New Note
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-muted-foreground">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              required
              disabled={isSubmitting}
              className="dark-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-muted-foreground">
              Content
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
              className="min-h-[200px] dark-input"
              required
              disabled={isSubmitting}
            />
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
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Add Note"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
