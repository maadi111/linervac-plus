"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

interface DoubleTapButtonProps {
  isActive: boolean
  onToggle: () => void
  activeIcon: React.ReactNode
  inactiveIcon: React.ReactNode
  activeLabel: string
  inactiveLabel: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export function DoubleTapButton({
  isActive,
  onToggle,
  activeIcon,
  inactiveIcon,
  activeLabel,
  inactiveLabel,
  className,
  size = "md",
}: DoubleTapButtonProps) {
  const [tapCount, setTapCount] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const tapTimeoutRef = useRef<NodeJS.Timeout>()

  const handleTap = useCallback(() => {
    if (tapCount === 0) {
      setTapCount(1)
      setShowHint(true)
      tapTimeoutRef.current = setTimeout(() => {
        setTapCount(0)
        setShowHint(false)
      }, 1000)
    } else {
      clearTimeout(tapTimeoutRef.current)
      setTapCount(0)
      setShowHint(false)
      onToggle()
    }
  }, [tapCount, onToggle])

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-20 h-20",
    lg: "w-24 h-24",
  }

  const iconSizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleTap}
        className={cn(
          "relative rounded-2xl flex items-center justify-center transition-all duration-200 active:scale-95",
          sizeClasses[size],
          isActive
            ? "bg-success text-success-foreground shadow-lg shadow-success/30"
            : "bg-muted text-muted-foreground hover:bg-muted/80",
          tapCount === 1 && "ring-2 ring-primary ring-offset-2 ring-offset-background",
          className,
        )}
      >
        <div className={iconSizeClasses[size]}>{isActive ? activeIcon : inactiveIcon}</div>

        {/* Tap hint overlay */}
        {showHint && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/80 rounded-2xl">
            <span className="text-background text-xs font-medium">Tap again</span>
          </div>
        )}
      </button>

      <span className={cn("text-xs font-medium text-center", isActive ? "text-success" : "text-muted-foreground")}>
        {isActive ? activeLabel : inactiveLabel}
      </span>
    </div>
  )
}
