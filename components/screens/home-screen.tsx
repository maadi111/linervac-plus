"use client"
import { useApp } from "@/lib/app-context"
import { useMQTT } from "@/lib/mqtt-context"
import { DoubleTapButton } from "@/components/ui/double-tap-button"
import { ShutdownButton } from "@/components/ui/shutdown-button"
import { Card, CardContent } from "@/components/ui/card"
import { Waves, Droplets, Video, VideoOff, Settings, Plus, Wifi, WifiOff, ChevronRight, Info } from "lucide-react"

export function HomeScreen() {
  const {
    user,
    units,
    activeUnit,
    setActiveUnit,
    toggleVacuum,
    toggleWaterValve,
    toggleCamera,
    safeHomeShutdown,
    setScreen,
  } = useApp()
  const { isConnected } = useMQTT()

  if (!activeUnit) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <p className="text-muted-foreground">No unit connected</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Waves className="w-6 h-6 text-primary" />
              LinerVac+
            </h1>
            {user && <p className="text-xs text-muted-foreground">Welcome, {user.name.split(" ")[0]}</p>}
          </div>
          <div className="flex items-center gap-2">
            {/* Connection status */}
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                isConnected ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              }`}
            >
              {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isConnected ? "Online" : "Offline"}
            </div>
            <button
              onClick={() => setScreen("settings")}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Unit Tabs (if multiple units) */}
        {units.length > 1 && (
          <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
            {units.map((unit) => (
              <button
                key={unit.id}
                onClick={() => setActiveUnit(unit.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  unit.id === activeUnit.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {unit.name}
              </button>
            ))}
            {units.length < 5 && (
              <button
                onClick={() => setScreen("add-unit")}
                className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-4">
        {/* Camera Preview */}
        <Card
          className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setScreen("camera-fullscreen")}
        >
          <div className="relative aspect-video bg-foreground/5">
            {activeUnit.status.camera ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                <div className="text-center">
                  <Video className="w-12 h-12 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Camera Feed Active</p>
                  <p className="text-xs text-muted-foreground mt-1">Tap to expand</p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <VideoOff className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Camera Off</p>
                </div>
              </div>
            )}
            {/* Live indicator */}
            {activeUnit.status.camera && (
              <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-destructive rounded-full">
                <div className="w-2 h-2 rounded-full bg-destructive-foreground animate-pulse" />
                <span className="text-xs font-medium text-destructive-foreground">LIVE</span>
              </div>
            )}
          </div>
        </Card>

        {/* Control Buttons */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-sm font-medium text-muted-foreground mb-4 text-center">Double-tap to toggle</h2>
            <div className="grid grid-cols-3 gap-6">
              <DoubleTapButton
                isActive={activeUnit.status.vacuum}
                onToggle={toggleVacuum}
                activeIcon={<Waves className="w-full h-full" />}
                inactiveIcon={<Waves className="w-full h-full" />}
                activeLabel="Vacuum On"
                inactiveLabel="Vacuum Off"
              />
              <DoubleTapButton
                isActive={activeUnit.status.waterValve}
                onToggle={toggleWaterValve}
                activeIcon={<Droplets className="w-full h-full" />}
                inactiveIcon={<Droplets className="w-full h-full" />}
                activeLabel="Valve Open"
                inactiveLabel="Valve Closed"
              />
              <DoubleTapButton
                isActive={activeUnit.status.camera}
                onToggle={toggleCamera}
                activeIcon={<Video className="w-full h-full" />}
                inactiveIcon={<VideoOff className="w-full h-full" />}
                activeLabel="Camera On"
                inactiveLabel="Camera Off"
              />
            </div>
          </CardContent>
        </Card>

        {/* Safe Home Button */}
        <ShutdownButton onConfirm={safeHomeShutdown} className="w-full" />

        {/* Unit Info Card */}
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setScreen("unit-info")}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Info className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{activeUnit.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{activeUnit.uuid}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
