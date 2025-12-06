"use client"
import { Waves } from "lucide-react"

export function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
      <div className="flex flex-col items-center gap-6 animate-pulse">
        <div className="w-24 h-24 rounded-2xl bg-primary-foreground/10 flex items-center justify-center">
          <Waves className="w-14 h-14 text-primary-foreground" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-foreground tracking-tight">LinerVac+</h1>
          <p className="text-primary-foreground/70 text-sm mt-1">Smart Pool Control</p>
        </div>
      </div>
      <div className="absolute bottom-12">
        <div className="w-8 h-8 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
      </div>
    </div>
  )
}
