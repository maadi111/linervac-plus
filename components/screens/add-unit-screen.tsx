"use client"

import type React from "react"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Hash, Camera, ArrowLeft, CheckCircle2 } from "lucide-react"

export function AddUnitScreen() {
  const { addUnit, setScreen, units } = useApp()
  const [uuid, setUuid] = useState("")
  const [unitName, setUnitName] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [isBinding, setIsBinding] = useState(false)
  const [bindSuccess, setBindSuccess] = useState(false)

  const handleAddUnit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uuid.trim()) return

    setIsBinding(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setBindSuccess(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    addUnit(uuid.trim(), unitName.trim() || undefined)
  }

  const handleScanQR = () => {
    setIsScanning(true)
    setTimeout(() => {
      setUuid("LV-" + Math.random().toString(36).substring(2, 10).toUpperCase())
      setIsScanning(false)
    }, 2000)
  }

  if (bindSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background px-6">
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-success" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Unit Added!</h1>
        <p className="text-muted-foreground mt-2 text-center">Your new LinerVac+ is ready to use.</p>
      </div>
    )
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
            <h1 className="text-lg font-bold text-foreground">Add New Unit</h1>
            <p className="text-xs text-muted-foreground">{units.length} of 5 units connected</p>
          </div>
        </div>
      </header>

      {/* QR Scanner Option */}
      <div className="px-6 mt-6 mb-4">
        <Card
          className={`border-2 cursor-pointer transition-all ${isScanning ? "border-primary bg-primary/5" : "border-dashed border-muted hover:border-primary/50"}`}
          onClick={!isScanning ? handleScanQR : undefined}
        >
          <CardContent className="flex flex-col items-center py-8">
            {isScanning ? (
              <>
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4 animate-pulse">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">Scanning...</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center mb-4">
                  <QrCode className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">Scan QR Code</p>
                <p className="text-xs text-muted-foreground mt-1">Tap to scan</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Divider */}
      <div className="px-6 flex items-center gap-4 mb-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground uppercase">or enter manually</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Manual Entry */}
      <div className="px-6 flex-1">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Hash className="w-5 h-5" />
              Manual Entry
            </CardTitle>
            <CardDescription>Enter the UUID from your unit</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddUnit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="uuid">Unit UUID</Label>
                <Input
                  id="uuid"
                  type="text"
                  placeholder="LV-XXXXXXXX"
                  value={uuid}
                  onChange={(e) => setUuid(e.target.value.toUpperCase())}
                  className="font-mono"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitName">Unit Name (Optional)</Label>
                <Input
                  id="unitName"
                  type="text"
                  placeholder="Pool House Vacuum"
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold"
                disabled={isBinding || !uuid.trim()}
              >
                {isBinding ? "Adding Unit..." : "Add Unit"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
