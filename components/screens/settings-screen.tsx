"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { useMQTT } from "@/lib/mqtt-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
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
import { ArrowLeft, User, Bell, Wifi, LogOut, ChevronRight, Plus, Volume2 } from "lucide-react"

export function SettingsScreen() {
  const { user, units, logout, setScreen } = useApp()
  const { isConnected, connectionStatus } = useMQTT()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)

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
          <h1 className="text-lg font-bold text-foreground">Settings</h1>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 space-y-4">
        {/* Profile */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{user?.name || "User"}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground">{user?.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connection Status */}
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isConnected ? "bg-success/10" : "bg-destructive/10"
                }`}
              >
                <Wifi className={`w-5 h-5 ${isConnected ? "text-success" : "text-destructive"}`} />
              </div>
              <div>
                <p className="font-medium text-foreground">Connection Status</p>
                <p className="text-xs text-muted-foreground capitalize">{connectionStatus}</p>
              </div>
            </div>
            <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-success" : "bg-destructive"}`} />
          </CardContent>
        </Card>

        {/* Units */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-medium text-foreground">My Units</p>
              {units.length < 5 && (
                <button
                  onClick={() => setScreen("add-unit")}
                  className="text-sm text-primary font-medium flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              )}
            </div>
            <div className="space-y-2">
              {units.map((unit) => (
                <div key={unit.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{unit.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{unit.uuid}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Notifications</p>
                  <p className="text-xs text-muted-foreground">Reed switch alerts</p>
                </div>
              </div>
              <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Alert Sound</p>
                  <p className="text-xs text-muted-foreground">Play sound on notification</p>
                </div>
              </div>
              <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} disabled={!notificationsEnabled} />
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full text-destructive border-destructive/30 hover:bg-destructive/10 bg-transparent"
          onClick={() => setShowLogoutConfirm(true)}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>

        {/* App Version */}
        <p className="text-center text-xs text-muted-foreground">LinerVac+ App v1.0.0</p>
      </main>

      {/* Logout Confirmation */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent className="max-w-[90vw] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out?</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to sign out of your account?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={logout}>Sign Out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
