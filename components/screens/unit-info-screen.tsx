"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { ArrowLeft, Hash, HardDrive, Clock, Calendar, Cpu, RotateCcw, Mail, Trash2 } from "lucide-react"

export function UnitInfoScreen() {
  const { activeUnit, setScreen, resetDataUsage, removeUnit, units } = useApp()
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)

  if (!activeUnit) return null

  const formatDate = (date: Date | null) => {
    if (!date) return "Never"
    return new Date(date).toLocaleString()
  }

  const formatDataUsage = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }

  const handleRemoveUnit = () => {
    removeUnit(activeUnit.id)
    if (units.length > 1) {
      setScreen("home")
    } else {
      setScreen("bind-unit")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => setScreen("home")}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Unit Information</h1>
            <p className="text-xs text-muted-foreground">{activeUnit.name}</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 space-y-4">
        {/* UUID */}
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Hash className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Unit UUID</p>
              <p className="font-mono text-sm text-foreground">{activeUnit.uuid}</p>
            </div>
          </CardContent>
        </Card>

        {/* Data Usage */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              Data Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{formatDataUsage(activeUnit.dataUsage)}</p>
                <p className="text-xs text-muted-foreground">Total transferred</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowResetConfirm(true)}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Operating Hours */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Operating Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Session Hours</span>
              <span className="text-sm font-medium">{activeUnit.sessionHours.toFixed(1)} hrs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Lifetime Hours</span>
              <span className="text-sm font-medium">{activeUnit.lifetimeHours.toFixed(1)} hrs</span>
            </div>
          </CardContent>
        </Card>

        {/* Power History */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Power History
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Last Power On</span>
              <span className="text-sm font-medium">{formatDate(activeUnit.lastPowerOn)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Last Power Off</span>
              <span className="text-sm font-medium">{formatDate(activeUnit.lastPowerOff)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Bound On</span>
              <span className="text-sm font-medium">{formatDate(activeUnit.bindDate)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Firmware */}
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Cpu className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Firmware Version</p>
              <p className="font-mono text-sm text-foreground">v{activeUnit.firmwareVersion}</p>
            </div>
          </CardContent>
        </Card>

        {/* Help / Contact */}
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <a href="mailto:support@linervac.com">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Help / Contact Us</p>
                <p className="text-xs text-muted-foreground">support@linervac.com</p>
              </div>
            </CardContent>
          </a>
        </Card>

        {/* Remove Unit */}
        <Button
          variant="outline"
          className="w-full text-destructive border-destructive/30 hover:bg-destructive/10 bg-transparent"
          onClick={() => setShowRemoveConfirm(true)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Remove This Unit
        </Button>
      </main>

      {/* Reset Data Confirmation */}
      <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <AlertDialogContent className="max-w-[90vw] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Data Usage?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset the data usage counter to zero. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                resetDataUsage(activeUnit.id)
                setShowResetConfirm(false)
              }}
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove Unit Confirmation */}
      <AlertDialog open={showRemoveConfirm} onOpenChange={setShowRemoveConfirm}>
        <AlertDialogContent className="max-w-[90vw] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Unit?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {activeUnit.name} from your account? You can re-bind it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveUnit}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
