"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppStore } from "@/lib/store"
import { ROLES } from "@/lib/types"

interface RequestAccessModalProps {
  children: React.ReactNode
}

export function RequestAccessModal({ children }: RequestAccessModalProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    staffId: "",
    role: "",
    division: "",
    notes: "",
  })

  const addAccessRequest = useAppStore((state) => state.addAccessRequest)

  const divisions = [
    "Management Services",
    "Operations",
    "Corporate Affairs",
    "Internal Audit",
    "Legal Services",
    "EduTech",
    "Infrastructure Planning & Development",
    "Apprenticeship",
    "Partnerships, WEL & Inclusion",
    "Training, Assessment & Quality Assurance",
    "Regional Office",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Add request to store
      addAccessRequest({
        name: formData.name,
        email: formData.email,
        staffId: formData.staffId || undefined,
        role: formData.role,
        division: formData.division,
        notes: formData.notes || undefined,
      })

      // Reset form and close modal
      setFormData({
        name: "",
        email: "",
        staffId: "",
        role: "",
        division: "",
        notes: "",
      })
      setOpen(false)

      // Show success message (you could add a toast here)
      alert("Access request submitted successfully! The System Administrator will review your request.")
    } catch (error) {
      console.error("Failed to submit access request:", error)
      alert("Failed to submit request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request System Access</DialogTitle>
          <DialogDescription>
            Submit your information to request access to the Performance Appraisal System. The Director-General will
            review and approve your request.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="your.email@appraisal.gov"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="staffId">Staff ID (Optional)</Label>
            <Input
              id="staffId"
              value={formData.staffId}
              onChange={(e) => handleInputChange("staffId", e.target.value)}
              placeholder="Leave blank if new staff"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role/Position *</Label>
            <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="division">Division/Unit *</Label>
            <Select value={formData.division} onValueChange={(value) => handleInputChange("division", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select your division" />
              </SelectTrigger>
              <SelectContent>
                {divisions.map((division) => (
                  <SelectItem key={division} value={division}>
                    {division}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Any additional information or special requests..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
