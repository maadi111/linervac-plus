"use client"

import { useState } from "react"
import { Power, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ShutdownButtonProps {
  onConfirm: () => void
  className?: string
}

export function ShutdownButton({ onConfirm, className }: ShutdownButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [isShuttingDown, setIsShuttingDown] = useState(false)

  const handleConfirm = async () => {
    setIsShuttingDown(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    onConfirm()
    setIsShuttingDown(false)
    setShowConfirm(false)
  }

  return (
    <>
      <Button
        variant="destructive"
        size="lg"
        className={`h-14 text-base font-semibold gap-2 ${className}`}
        onClick={() => setShowConfirm(true)}
      >
        <Power className="w-5 h-5" />
        Safe Home
      </Button>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="max-w-[90vw] rounded-2xl">
          <AlertDialogHeader>
            <div className="mx-auto w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mb-2">
              <AlertTriangle className="w-8 h-8 text-warning" />
            </div>
            <AlertDialogTitle className="text-center text-xl">Confirm Safe Home Shutdown</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              This will turn off the vacuum, water valve, and camera. The unit will enter a safe standby mode.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isShuttingDown}
              className="w-full h-12 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isShuttingDown ? "Shutting Down..." : "Yes, Shutdown"}
            </AlertDialogAction>
            <AlertDialogCancel className="w-full h-12 mt-0">Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
