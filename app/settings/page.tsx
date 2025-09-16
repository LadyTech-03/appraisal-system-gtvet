"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore, useAppStore } from "@/lib/store"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, User, Download, Upload, Trash2 } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { exportData, importData } = useAppStore()
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [importText, setImportText] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  const handleExport = () => {
    try {
      const data = exportData()
      const blob = new Blob([data], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "appraisal-system-backup.json"
      a.click()
      URL.revokeObjectURL(url)
      setMessage({ type: "success", text: "Data exported successfully!" })
    } catch (error) {
      setMessage({ type: "error", text: "Failed to export data. Please try again." })
    }
  }

  const handleImport = () => {
    try {
      if (!importText.trim()) {
        setMessage({ type: "error", text: "Please paste the import data first." })
        return
      }
      importData(importText)
      setMessage({ type: "success", text: "Data imported successfully!" })
      setImportText("")
    } catch (error) {
      setMessage({ type: "error", text: "Failed to import data. Please check the format and try again." })
    }
  }

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      try {
        localStorage.removeItem("app-storage")
        localStorage.removeItem("auth-storage")
        setMessage({ type: "success", text: "All data cleared. Please refresh the page." })
      } catch (error) {
        setMessage({ type: "error", text: "Failed to clear data. Please try again." })
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="flex-1 p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Settings</h1>
              <p className="text-muted-foreground">Manage your account and system preferences</p>
            </div>
          </div>

          {message && (
            <Alert variant={message.type === "error" ? "destructive" : "default"}>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {/* User Profile */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <span>User Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={user.name} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Staff ID</Label>
                  <Input value={user.staffId} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={user.email || "Not provided"} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input value={user.role} disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Division</Label>
                <Input value={user.division || "Not specified"} disabled />
              </div>
              <p className="text-sm text-muted-foreground">
                To update your profile information, please contact your system administrator.
              </p>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-primary" />
                <span>Data Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Export Data */}
              <div className="space-y-3">
                <h3 className="font-semibold">Export Data</h3>
                <p className="text-sm text-muted-foreground">
                  Download a backup of all system data including users, appraisals, and organizational structure.
                </p>
                <Button onClick={handleExport} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export System Data
                </Button>
              </div>

              {/* Import Data */}
              <div className="space-y-3">
                <h3 className="font-semibold">Import Data</h3>
                <p className="text-sm text-muted-foreground">
                  Restore system data from a previously exported backup. This will replace all current data.
                </p>
                <div className="space-y-2">
                  <Label>Import Data (JSON)</Label>
                  <Textarea
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder="Paste your exported JSON data here..."
                    rows={6}
                  />
                </div>
                <Button onClick={handleImport} disabled={!importText.trim()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Data
                </Button>
              </div>

              {/* Clear Data */}
              {user.role === "Director-General" && (
                <div className="space-y-3 pt-6 border-t border-destructive/20">
                  <h3 className="font-semibold text-destructive">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete all system data. This action cannot be undone.
                  </p>
                  <Button onClick={handleClearData} variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Data
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Information */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Version</p>
                  <p className="text-muted-foreground">1.0.0</p>
                </div>
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p className="text-muted-foreground">{new Date().toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-medium">Storage</p>
                  <p className="text-muted-foreground">Local Browser Storage</p>
                </div>
                <div>
                  <p className="font-medium">Environment</p>
                  <p className="text-muted-foreground">Development</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
