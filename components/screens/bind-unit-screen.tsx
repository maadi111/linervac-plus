"use client"

import type React from "react"

import { useState } from "react"
import { useApp } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Hash, Camera, CheckCircle2 } from "lucide-react"

export function BindUnitScreen() {
  const { bindUnit, user } = useApp()
  const [uuid, setUuid] = useState("")
  const [unitName, setUnitName] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [isBinding, setIsBinding] = useState(false)
  const [bindSuccess, setBindSuccess] = useState(false)

  const handleManualBind = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uuid.trim()) return

    setIsBinding(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setBindSuccess(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    bindUnit(uuid.trim(), unitName.trim() || undefined)
  }

  const handleScanQR = () => {
    setIsScanning(true)
    // Simulate QR scan
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
        <h1 className="text-2xl font-bold text-foreground">Unit Bound Successfully!</h1>
        <p className="text-muted-foreground mt-2 text-center">Your LinerVac+ is now connected and ready to use.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold text-foreground">Bind Your Unit</h1>
        <p className="text-muted-foreground mt-1">
          {user?.name ? `Welcome ${user.name.split(" ")[0]}! ` : ""}Connect your LinerVac+ device
        </p>
      </div>

      {/* QR Scanner Option */}
      <div className="px-6 mb-4">
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
                <p className="text-xs text-muted-foreground mt-1">Point at QR code on unit</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center mb-4">
                  <QrCode className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">Scan QR Code</p>
                <p className="text-xs text-muted-foreground mt-1">Tap to scan the QR code on your unit</p>
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
            <CardDescription>Enter the UUID found on your unit label</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleManualBind} className="space-y-4">
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
                  placeholder="My Pool Vacuum"
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold"
                disabled={isBinding || !uuid.trim()}
              >
                {isBinding ? "Binding Unit..." : "Bind Unit"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Progress indicator */}
      <div className="px-6 py-8">
        <div className="flex gap-2 justify-center">
          <div className="w-8 h-2 rounded-full bg-primary" />
          <div className="w-8 h-2 rounded-full bg-primary" />
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">Step 2 of 2</p>
      </div>
    </div>
  )
}
