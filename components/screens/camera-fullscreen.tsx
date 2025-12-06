"use client"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { X, ZoomIn, ZoomOut, RotateCcw, Video, VideoOff } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CameraFullscreen() {
  const { activeUnit, setScreen, toggleCamera } = useApp()
  const [zoom, setZoom] = useState(1)

  if (!activeUnit) return null

  return (
    <div className="fixed inset-0 z-50 bg-foreground flex flex-col">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-foreground/80 to-transparent">
        <div className="flex items-center gap-2">
          {activeUnit.status.camera && (
            <div className="flex items-center gap-1 px-2 py-1 bg-destructive rounded-full">
              <div className="w-2 h-2 rounded-full bg-destructive-foreground animate-pulse" />
              <span className="text-xs font-medium text-destructive-foreground">LIVE</span>
            </div>
          )}
          <span className="text-sm text-background/80">{activeUnit.name}</span>
        </div>
        <button
          onClick={() => setScreen("home")}
          className="w-10 h-10 rounded-full bg-background/20 flex items-center justify-center"
        >
          <X className="w-6 h-6 text-background" />
        </button>
      </header>

      {/* Camera View */}
      <div className="flex-1 flex items-center justify-center overflow-hidden" style={{ transform: `scale(${zoom})` }}>
        {activeUnit.status.camera ? (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
            <div className="text-center">
              <Video className="w-20 h-20 text-background/50 mx-auto mb-4" />
              <p className="text-background/70">Live Camera Feed</p>
              <p className="text-sm text-background/50 mt-1">Pinch to zoom</p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <VideoOff className="w-20 h-20 text-background/30 mx-auto mb-4" />
            <p className="text-background/50">Camera is turned off</p>
            <Button variant="secondary" className="mt-4" onClick={toggleCamera}>
              Turn On Camera
            </Button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/80 to-transparent">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setZoom(Math.max(1, zoom - 0.25))}
            disabled={zoom <= 1}
            className="w-12 h-12 rounded-full bg-background/20 flex items-center justify-center disabled:opacity-50"
          >
            <ZoomOut className="w-6 h-6 text-background" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="w-12 h-12 rounded-full bg-background/20 flex items-center justify-center"
          >
            <RotateCcw className="w-6 h-6 text-background" />
          </button>
          <button
            onClick={() => setZoom(Math.min(3, zoom + 0.25))}
            disabled={zoom >= 3}
            className="w-12 h-12 rounded-full bg-background/20 flex items-center justify-center disabled:opacity-50"
          >
            <ZoomIn className="w-6 h-6 text-background" />
          </button>
        </div>
        <p className="text-center text-xs text-background/50 mt-2">Zoom: {Math.round(zoom * 100)}%</p>
      </div>
    </div>
  )
}
