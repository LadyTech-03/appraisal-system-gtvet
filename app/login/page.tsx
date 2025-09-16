"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuthStore, useAppStore } from "@/lib/store"
import { Shield, BookOpen, GraduationCap, Award } from "lucide-react"
import { RequestAccessModal } from "@/components/request-access-modal"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const { roles } = useAppStore()
  const [formData, setFormData] = useState({
    emailOrStaffId: "",
    password: "",
    role: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showRequestAccess, setShowRequestAccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const success = await login(formData.emailOrStaffId, formData.password, formData.role)
      if (success) {
        router.push("/dashboard")
      } else {
        setError("Invalid credentials. Please check your email/staff ID, password, and role.")
        setShowRequestAccess(true)
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md glass-card">
          <CardHeader className="text-center">
            <Image src="/logos/logo.png" alt="Appraisal System Logo" width={80} height={80} className="mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-primary">STAFF PERFORMANCE AND APPRAISAL SYSTEM</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emailOrStaffId">Email or Staff ID</Label>
                <Input
                  id="emailOrStaffId"
                  type="text"
                  placeholder="Enter your email or staff ID"
                  value={formData.emailOrStaffId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, emailOrStaffId: e.target.value }))}
                  required
                  className="bg-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  required
                  className="bg-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role/Position</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                >
                  <SelectTrigger className="bg-input">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              <div className="text-center">
                <RequestAccessModal>
                  <Button type="button" variant="link" className="text-sm text-muted-foreground hover:text-primary">
                    Don't have access? Request Access
                  </Button>
                </RequestAccessModal>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Demo Credentials:</p>
              <p>Email: dg@appraisal.gov | Password: admin123 | Role: Director-General</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Educational Theme Illustration */}
      <div className="flex-1 relative overflow-hidden">
        <div
          className="absolute inset-40 bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/modern-educational-workspace-with-books-laptop-and.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-blue-700/30" />

        {/* <div className="relative z-10 flex items-center justify-center h-full p-8">
          <div className="text-center text-white max-w-md">
            <div className="mb-8 flex justify-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Award className="w-8 h-8" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4">Excellence in Education</h2>
            <p className="text-lg opacity-90 mb-6">
              Empowering educational professionals through comprehensive performance management and continuous learning.
            </p>
            <div className="space-y-2 text-sm opacity-80">
              <p>✓ Professional Development Tracking</p>
              <p>✓ Competency-Based Assessments</p>
              <p>✓ Career Growth Planning</p>
              <p>✓ Educational Excellence Standards</p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}
