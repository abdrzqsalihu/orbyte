"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NotificationProps {
  message: string
  onDismiss: () => void
}

export function Notification({ message, onDismiss }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onDismiss, 300)
    }, 5000)

    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div
      className={cn(
        "bg-secondary border border-border rounded-lg shadow-lg p-3 flex items-center transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0",
      )}
    >
      <p className="text-sm mr-2">{message}</p>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 ml-2 text-muted-foreground hover:text-foreground"
        onClick={onDismiss}
      >
        <X className="h-3 w-3" />
        <span className="sr-only">Dismiss</span>
      </Button>
    </div>
  )
}
