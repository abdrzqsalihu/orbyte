"use client";

import { createClient } from "@/lib/supabase/client";
import type { AppNotification } from "@/lib/types";
import { toast } from "sonner";

const NOTIFICATION_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

let audio: HTMLAudioElement | null = null;

const getAudio = () => {
  if (typeof window === "undefined") return null;
  if (!audio) {
    audio = new Audio(NOTIFICATION_SOUND_URL);
    audio.volume = 0.5;
  }
  return audio;
};

export const playNotificationSound = () => {
  const sound = getAudio();
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }
};

export const requestBrowserPermission = async (): Promise<boolean> => {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

export const sendBrowserNotification = async (
  title: string,
  options?: NotificationOptions,
): Promise<boolean> => {
  if (Notification.permission !== "granted") {
    return false;
  }

  try {
    new Notification(title, {
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      ...options,
    });
    return true;
  } catch {
    return false;
  }
};

export const triggerNotification = async (
  userId: string,
  notification: Omit<AppNotification, "id" | "user_id" | "created_at" | "is_read">,
): Promise<void> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("notifications")
    .insert({ user_id: userId, ...notification })
    .select()
    .single();

  if (error) {
    console.error("Failed to insert notification:", error);
    return;
  }

  const toastId = toast.success(notification.title, {
    description: notification.message,
    duration: 5000,
  });

  playNotificationSound();

  const hasPermission = await requestBrowserPermission();
  if (hasPermission && document.hidden) {
    sendBrowserNotification(notification.title, {
      body: notification.message,
      tag: "orbyte-notification",
      silent: false,
    });
  }
};

export const useNotificationService = (userId: string) => {
  const notifyTaskCreated = (taskTitle: string) => {
    triggerNotification(userId, {
      title: "Task Created",
      message: `"${taskTitle}" has been added to your board.`,
      type: "task",
    });
  };

  const notifyTaskCompleted = (taskTitle: string) => {
    triggerNotification(userId, {
      title: "Task Completed",
      message: `"${taskTitle}" has been marked as done.`,
      type: "task",
    });
  };

  const notifyTaskDeleted = (taskTitle: string) => {
    triggerNotification(userId, {
      title: "Task Deleted",
      message: `"${taskTitle}" has been removed.`,
      type: "task",
    });
  };

  const notifyNoteCreated = (noteTitle: string) => {
    triggerNotification(userId, {
      title: "Note Created",
      message: `"${noteTitle}" has been saved.`,
      type: "note",
    });
  };

  const notifyNoteUpdated = (noteTitle: string) => {
    triggerNotification(userId, {
      title: "Note Updated",
      message: `"${noteTitle}" has been updated.`,
      type: "note",
    });
  };

  const notifyNoteDeleted = (noteTitle: string) => {
    triggerNotification(userId, {
      title: "Note Deleted",
      message: `"${noteTitle}" has been removed.`,
      type: "note",
    });
  };

  const notifyReminder = (message: string) => {
    triggerNotification(userId, {
      title: "Reminder",
      message,
      type: "reminder",
    });
  };

  const notifySystem = (message: string) => {
    triggerNotification(userId, {
      title: "System",
      message,
      type: "system",
    });
  };

  return {
    notifyTaskCreated,
    notifyTaskCompleted,
    notifyTaskDeleted,
    notifyNoteCreated,
    notifyNoteUpdated,
    notifyNoteDeleted,
    notifyReminder,
    notifySystem,
  };
};