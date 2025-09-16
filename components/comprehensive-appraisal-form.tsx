"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2 } from "lucide-react"
import { useAuthStore, useAppStore } from "@/lib/store"
import type { Appraisal } from "@/lib/types"

interface ComprehensiveAppraisalFormProps {
  employeeId: string
  onSave: () => void
  onSubmit: () => void
  mode?: "appraisee" | "appraiser" | "view"
  existingAppraisal?: Appraisal
}

export function ComprehensiveAppraisalForm({
  employeeId,
  onSave,
  onSubmit,
  mode = "appraiser",
  existingAppraisal,
}: ComprehensiveAppraisalFormProps) {
  const { user } = useAuthStore()
  const { users, addAppraisal, updateAppraisal } = useAppStore()
  const [isDraft, setIsDraft] = useState(true)

  const employee = users.find((u) => u.id === employeeId)
  const appraiser = mode === "appraisee" ? users.find((u) => u.id === employee?.managerId) : user

  const [formData, setFormData] = useState<Partial<Appraisal>>(() => {
    if (existingAppraisal) {
      return existingAppraisal
    }

    const baseData = {
      employeeId,
      appraiserId: mode === "appraisee" ? employee?.managerId || "" : user?.id || "",
      periodStart: new Date().getFullYear() + "-01-01",
      periodEnd: new Date().getFullYear() + "-12-31",
      status: mode === "appraisee" ? "draft" : "draft",
      createdBy: mode,
      employeeInfo: {
        title: "Mr.",
        surname: employee?.name.split(" ").pop() || "",
        firstName: employee?.name.split(" ")[0] || "",
        otherNames: employee?.name.split(" ").slice(1, -1).join(" ") || "",
        gender: "Male",
        grade: "Grade 15",
        position: employee?.role || "",
        department: employee?.division || "",
        appointmentDate: "2020-01-01",
      },
      appraiserInfo: {
        title: "Mr.",
        surname: appraiser?.name.split(" ").pop() || "",
        firstName: appraiser?.name.split(" ")[0] || "",
        otherNames: appraiser?.name.split(" ").slice(1, -1).join(" ") || "",
        position: appraiser?.role || "",
      },
      trainingReceived: [],
      keyResultAreas: [
        {
          id: "1",
          area: "",
          targets: "",
          resourcesRequired: "",
        },
      ],
      midYearReview: {
        targets: [
          { id: "1", target: "", progressReview: "", remarks: "" },
          { id: "2", target: "", progressReview: "", remarks: "" },
          { id: "3", target: "", progressReview: "", remarks: "" },
        ],
        competencies: [
          { id: "1", competency: "", progressReview: "", remarks: "" },
          { id: "2", competency: "", progressReview: "", remarks: "" },
          { id: "3", competency: "", progressReview: "", remarks: "" },
        ],
        reviewDate: "",
        appraiseeSignature: "",
        appraiserSignature: "",
      },
      endOfYearReview: {
        targets: [],
        totalScore: 0,
        averageScore: 0,
        weightedScore: 0,
      },
      coreCompetencies: {
        organizationManagement: {
          planOrganizeWork: { weight: 0.3, score: 3 },
          workSystematically: { weight: 0.3, score: 3 },
          manageOthers: { weight: 0.3, score: 3 },
          total: 0,
          average: 0,
          comments: "",
        },
        innovationStrategicThinking: {
          supportChange: { weight: 0.3, score: 3 },
          thinkBroadly: { weight: 0.3, score: 3 },
          originalityThinking: { weight: 0.3, score: 3 },
          total: 0,
          average: 0,
          comments: "",
        },
        leadershipDecisionMaking: {
          initiateAction: { weight: 0.3, score: 3 },
          acceptResponsibility: { weight: 0.3, score: 3 },
          exerciseJudgment: { weight: 0.3, score: 3 },
          total: 0,
          average: 0,
          comments: "",
        },
        developingImproving: {
          organizationDevelopment: { weight: 0.3, score: 3 },
          customerSatisfaction: { weight: 0.3, score: 3 },
          personnelDevelopment: { weight: 0.3, score: 3 },
          total: 0,
          average: 0,
          comments: "",
        },
        communication: {
          communicateDecisions: { weight: 0.3, score: 3 },
          negotiateManageConflict: { weight: 0.3, score: 3 },
          relateNetwork: { weight: 0.3, score: 3 },
          total: 0,
          average: 0,
          comments: "",
        },
        jobKnowledgeTechnicalSkills: {
          mentalPhysicalSkills: { weight: 0.3, score: 3 },
          crossFunctionalAwareness: { weight: 0.3, score: 3 },
          buildingApplyingExpertise: { weight: 0.3, score: 3 },
          total: 0,
          average: 0,
          comments: "",
        },
        supportingCooperating: {
          workEffectively: { weight: 0.3, score: 3 },
          showSupport: { weight: 0.3, score: 3 },
          adhereEthics: { weight: 0.3, score: 3 },
          total: 0,
          average: 0,
          comments: "",
        },
        maximizingProductivity: {
          motivateInspire: { weight: 0.3, score: 3 },
          acceptChallenges: { weight: 0.3, score: 3 },
          managePressure: { weight: 0.3, score: 3 },
          total: 0,
          average: 0,
          comments: "",
        },
        budgetCostManagement: {
          financialAwareness: { weight: 0.3, score: 3 },
          businessProcesses: { weight: 0.3, score: 3 },
          resultBasedActions: { weight: 0.3, score: 3 },
          total: 0,
          average: 0,
          comments: "",
        },
        coreCompetenciesAverage: 0,
      },
      nonCoreCompetencies: {
        developStaff: {
          developOthers: { weight: 0.1, score: 3 },
          provideGuidance: { weight: 0.1, score: 3 },
          total: 0,
          average: 0,
        },
        personalDevelopment: {
          eagernessForDevelopment: { weight: 0.1, score: 3 },
          innerDrive: { weight: 0.1, score: 3 },
          total: 0,
          average: 0,
        },
        deliveringResults: {
          customerSatisfaction: { weight: 0.1, score: 3 },
          qualityService: { weight: 0.1, score: 3 },
          total: 0,
          average: 0,
        },
        followingInstructions: {
          regulations: { weight: 0.1, score: 3 },
          customerFeedback: { weight: 0.1, score: 3 },
          total: 0,
          average: 0,
        },
        respectCommitment: {
          respectSuperiors: { weight: 0.1, score: 3 },
          commitmentWork: { weight: 0.1, score: 3 },
          total: 0,
          average: 0,
        },
        teamWork: {
          functionInTeam: { weight: 0.1, score: 3 },
          workInTeam: { weight: 0.1, score: 3 },
          total: 0,
          average: 0,
        },
        nonCoreCompetenciesAverage: 0,
      },
      overallAssessment: {
        performanceScore: 0,
        coreCompetenciesScore: 0,
        nonCoreCompetenciesScore: 0,
        overallTotal: 0,
        overallPercentage: 0,
        overallRating: 3,
        ratingDescription: "Met all Expectations",
      },
      appraiserComments: "",
      trainingDevelopmentPlan: "",
      assessmentDecision: "suitable",
      appraiseeComments: "",
      hodComments: "",
      hodName: "",
      hodSignature: "",
      hodDate: "",
      appraiserSignature: "",
      appraiserSignatureDate: "",
      appraiseeSignature: "",
      appraiseeSignatureDate: "",
    }

    return baseData as Partial<Appraisal>
  })

  const isFieldVisible = (section: string, field?: string) => {
    if (mode === "view") return true

    switch (section) {
      case "appraiserInfo":
        return mode === "appraiser"
      case "appraiserComments":
      case "trainingDevelopmentPlan":
      case "assessmentDecision":
      case "hodComments":
        return mode === "appraiser"
      case "coreCompetencies":
      case "nonCoreCompetencies":
        return mode === "appraiser"
      case "overallAssessment":
        return mode === "appraiser"
      default:
        return true
    }
  }

  const isFieldEditable = (section: string, field?: string) => {
    if (mode === "view") return false

    if (existingAppraisal && existingAppraisal.status === "pending-review" && mode === "appraiser") {
      // Appraiser can edit appraiser-specific sections when reviewing
      switch (section) {
        case "appraiserComments":
        case "trainingDevelopmentPlan":
        case "assessmentDecision":
        case "hodComments":
        case "coreCompetencies":
        case "nonCoreCompetencies":
        case "overallAssessment":
          return true
        default:
          return false
      }
    }

    if (existingAppraisal && existingAppraisal.createdBy === "appraisee" && mode === "appraisee") {
      // Appraisee can only edit their own sections if not yet submitted
      return existingAppraisal.status === "draft"
    }

    return true
  }

  const calculateCompetencyScores = (competencies: any) => {
    if (!competencies) return competencies

    const updatedCore = { ...competencies }

    // Calculate totals and averages for each competency group
    Object.keys(updatedCore).forEach((key) => {
      if (key !== "coreCompetenciesAverage") {
        const group = updatedCore[key as keyof typeof updatedCore] as any
        if (group && typeof group === "object" && "total" in group) {
          const scores = Object.values(group).filter(
            (item) => typeof item === "object" && item !== null && "score" in item,
          ) as Array<{ score: number; weight: number }>

          const total = scores.reduce((sum, item) => sum + item.score * item.weight, 0)
          const average = scores.length > 0 ? total / scores.reduce((sum, item) => sum + item.weight, 0) : 0

          group.total = total
          group.average = average
        }
      }
    })

    // Calculate overall core competencies average
    const competencyGroups = Object.keys(updatedCore).filter((key) => key !== "coreCompetenciesAverage")
    const overallAverage =
      competencyGroups.reduce((sum, key) => {
        const group = updatedCore[key as keyof typeof updatedCore] as any
        return sum + (group?.average || 0)
      }, 0) / competencyGroups.length

    updatedCore.coreCompetenciesAverage = overallAverage

    return updatedCore
  }

  const addTrainingEntry = () => {
    setFormData((prev) => ({
      ...prev,
      trainingReceived: [...(prev.trainingReceived || []), { institution: "", date: "", programme: "" }],
    }))
  }

  const removeTrainingEntry = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      trainingReceived: prev.trainingReceived?.filter((_, i) => i !== index) || [],
    }))
  }

  const addKeyResultArea = () => {
    setFormData((prev) => ({
      ...prev,
      keyResultAreas: [
        ...(prev.keyResultAreas || []),
        {
          id: Date.now().toString(),
          area: "",
          targets: "",
          resourcesRequired: "",
        },
      ],
    }))
  }

  const removeKeyResultArea = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      keyResultAreas: prev.keyResultAreas?.filter((_, i) => i !== index) || [],
    }))
  }

  const addMidYearTarget = () => {
    setFormData((prev) => ({
      ...prev,
      midYearReview: {
        ...prev.midYearReview!,
        targets: [
          ...(prev.midYearReview?.targets || []),
          { no: (prev.midYearReview?.targets?.length || 0) + 1, target: "", progressReview: "", remarks: "" },
        ],
      },
    }))
  }

  const removeMidYearTarget = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      midYearReview: {
        ...prev.midYearReview!,
        targets: prev.midYearReview?.targets?.filter((_, i) => i !== index) || [],
      },
    }))
  }

  const addMidYearCompetency = () => {
    setFormData((prev) => ({
      ...prev,
      midYearReview: {
        ...prev.midYearReview!,
        competencies: [
          ...(prev.midYearReview?.competencies || []),
          { no: (prev.midYearReview?.competencies?.length || 0) + 1, competency: "", progressReview: "", remarks: "" },
        ],
      },
    }))
  }

  const removeMidYearCompetency = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      midYearReview: {
        ...prev.midYearReview!,
        competencies: prev.midYearReview?.competencies?.filter((_, i) => i !== index) || [],
      },
    }))
  }

  const addEndYearTarget = () => {
    setFormData((prev) => ({
      ...prev,
      endOfYearReview: {
        ...prev.endOfYearReview!,
        targets: [
          ...(prev.endOfYearReview?.targets || []),
          {
            no: (prev.endOfYearReview?.targets?.length || 0) + 1,
            target: "",
            performanceAssessment: "",
            weightOfTarget: 5,
            score: 0,
            comments: "",
          },
        ],
      },
    }))
  }

  const removeEndYearTarget = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      endOfYearReview: {
        ...prev.endOfYearReview!,
        targets: prev.endOfYearReview?.targets?.filter((_, i) => i !== index) || [],
      },
    }))
  }

  const calculateEndYearTotals = () => {
    const targets = formData.endOfYearReview?.targets || []
    const totalScore = targets.reduce((sum, target) => sum + (target.score || 0), 0)
    const averageScore = targets.length > 0 ? totalScore / targets.length : 0
    const weightedScore = averageScore * 0.6

    setFormData((prev) => ({
      ...prev,
      endOfYearReview: {
        ...prev.endOfYearReview!,
        totalScore,
        averageScore,
        weightedScore,
      },
    }))
  }

  const handleSave = () => {
    if (existingAppraisal) {
      updateAppraisal(existingAppraisal.id, formData)
    } else {
      addAppraisal(formData as Omit<Appraisal, "id" | "createdAt" | "updatedAt">)
    }
    onSave()
  }

  const handleSubmit = () => {
    const submitData = {
      ...formData,
      status: mode === "appraisee" ? "pending-review" : "submitted",
    }

    if (existingAppraisal) {
      updateAppraisal(existingAppraisal.id, submitData)
    } else {
      addAppraisal(submitData as Omit<Appraisal, "id" | "createdAt" | "updatedAt">)
    }
    onSubmit()
  }

  const getRatingDescription = (score: number) => {
    if (score >= 4.5) return "Exceptional, exceeded expectations"
    if (score >= 3.5) return "Exceeded Expectations"
    if (score >= 2.5) return "Met all Expectations"
    if (score >= 1.5) return "Below Expectation"
    return "Unacceptable"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card">
        <CardHeader className="text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-primary">PUBLIC SERVICES PERFORMANCE MANAGEMENT</h1>
            <h2 className="text-lg font-semibold">(STAFF PERFORMANCE PLANNING, REVIEW AND APPRAISAL FORM)</h2>
            <Badge variant="destructive" className="mx-auto">
              STRICTLY CONFIDENTIAL
            </Badge>
            {mode === "appraisee" && (
              <Badge variant="secondary" className="mx-auto">
                Self-Assessment Mode
              </Badge>
            )}
            {mode === "appraiser" && existingAppraisal?.createdBy === "appraisee" && (
              <Badge variant="outline" className="mx-auto">
                Manager Review Mode
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Section 1A: Appraisee Personal Information */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>SECTION 1-A: Appraisee Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Period of Report From (dd/mm/yyyy)</Label>
              <Input
                type="date"
                value={formData.periodStart}
                onChange={(e) => setFormData((prev) => ({ ...prev, periodStart: e.target.value }))}
                disabled={!isFieldEditable("periodStart")}
              />
            </div>
            <div className="space-y-2">
              <Label>To (dd/mm/yyyy)</Label>
              <Input
                type="date"
                value={formData.periodEnd}
                onChange={(e) => setFormData((prev) => ({ ...prev, periodEnd: e.target.value }))}
                disabled={!isFieldEditable("periodEnd")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Select
                value={formData.employeeInfo?.title}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    employeeInfo: { ...prev.employeeInfo!, title: value },
                  }))
                }
                disabled={!isFieldEditable("employeeInfo", "title")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mr.">Mr.</SelectItem>
                  <SelectItem value="Mrs.">Mrs.</SelectItem>
                  <SelectItem value="Ms.">Ms.</SelectItem>
                  <SelectItem value="Dr.">Dr.</SelectItem>
                  <SelectItem value="Prof.">Prof.</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Surname</Label>
              <Input
                value={formData.employeeInfo?.surname}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    employeeInfo: { ...prev.employeeInfo!, surname: e.target.value },
                  }))
                }
                disabled={!isFieldEditable("employeeInfo", "surname")}
              />
            </div>
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input
                value={formData.employeeInfo?.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    employeeInfo: { ...prev.employeeInfo!, firstName: e.target.value },
                  }))
                }
                disabled={!isFieldEditable("employeeInfo", "firstName")}
              />
            </div>
            <div className="space-y-2">
              <Label>Other Name(s)</Label>
              <Input
                value={formData.employeeInfo?.otherNames}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    employeeInfo: { ...prev.employeeInfo!, otherNames: e.target.value },
                  }))
                }
                disabled={!isFieldEditable("employeeInfo", "otherNames")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select
                value={formData.employeeInfo?.gender}
                onValueChange={(value: "Male" | "Female") =>
                  setFormData((prev) => ({
                    ...prev,
                    employeeInfo: { ...prev.employeeInfo!, gender: value },
                  }))
                }
                disabled={!isFieldEditable("employeeInfo", "gender")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Grade/Salary (p.a)</Label>
              <Input
                value={formData.employeeInfo?.grade}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    employeeInfo: { ...prev.employeeInfo!, grade: e.target.value },
                  }))
                }
                disabled={!isFieldEditable("employeeInfo", "grade")}
              />
            </div>
            <div className="space-y-2">
              <Label>Date of Appointment to Present Grade</Label>
              <Input
                type="date"
                value={formData.employeeInfo?.appointmentDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    employeeInfo: { ...prev.employeeInfo!, appointmentDate: e.target.value },
                  }))
                }
                disabled={!isFieldEditable("employeeInfo", "appointmentDate")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Present Job Title/Position</Label>
              <Input
                value={formData.employeeInfo?.position}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    employeeInfo: { ...prev.employeeInfo!, position: e.target.value },
                  }))
                }
                disabled={!isFieldEditable("employeeInfo", "position")}
              />
            </div>
            <div className="space-y-2">
              <Label>Department/Division</Label>
              <Input
                value={formData.employeeInfo?.department}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    employeeInfo: { ...prev.employeeInfo!, department: e.target.value },
                  }))
                }
                disabled={!isFieldEditable("employeeInfo", "department")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 1B: Appraiser Information - Only visible to appraiser */}
      {isFieldVisible("appraiserInfo") && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>SECTION 1-B: Appraiser Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Select
                  value={formData.appraiserInfo?.title}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      appraiserInfo: { ...prev.appraiserInfo!, title: value },
                    }))
                  }
                  disabled={!isFieldEditable("appraiserInfo", "title")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mr.">Mr.</SelectItem>
                    <SelectItem value="Mrs.">Mrs.</SelectItem>
                    <SelectItem value="Ms.">Ms.</SelectItem>
                    <SelectItem value="Dr.">Dr.</SelectItem>
                    <SelectItem value="Prof.">Prof.</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Surname</Label>
                <Input
                  value={formData.appraiserInfo?.surname}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      appraiserInfo: { ...prev.appraiserInfo!, surname: e.target.value },
                    }))
                  }
                  disabled={!isFieldEditable("appraiserInfo", "surname")}
                />
              </div>
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  value={formData.appraiserInfo?.firstName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      appraiserInfo: { ...prev.appraiserInfo!, firstName: e.target.value },
                    }))
                  }
                  disabled={!isFieldEditable("appraiserInfo", "firstName")}
                />
              </div>
              <div className="space-y-2">
                <Label>Other Name(s)</Label>
                <Input
                  value={formData.appraiserInfo?.otherNames}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      appraiserInfo: { ...prev.appraiserInfo!, otherNames: e.target.value },
                    }))
                  }
                  disabled={!isFieldEditable("appraiserInfo", "otherNames")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Position of Appraiser</Label>
              <Input
                value={formData.appraiserInfo?.position}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    appraiserInfo: { ...prev.appraiserInfo!, position: e.target.value },
                  }))
                }
                disabled={!isFieldEditable("appraiserInfo", "position")}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Training Received */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>TRAINING RECEIVED DURING THE PREVIOUS YEAR</CardTitle>
            <Button onClick={addTrainingEntry} size="sm" disabled={!isFieldEditable("trainingReceived")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Training
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.trainingReceived?.map((training, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label>Institution</Label>
                <Input
                  value={training.institution}
                  onChange={(e) => {
                    const updated = [...(formData.trainingReceived || [])]
                    updated[index] = { ...updated[index], institution: e.target.value }
                    setFormData((prev) => ({ ...prev, trainingReceived: updated }))
                  }}
                  disabled={!isFieldEditable("trainingReceived")}
                />
              </div>
              <div className="space-y-2">
                <Label>Date (dd-mm-yyyy)</Label>
                <Input
                  type="date"
                  value={training.date}
                  onChange={(e) => {
                    const updated = [...(formData.trainingReceived || [])]
                    updated[index] = { ...updated[index], date: e.target.value }
                    setFormData((prev) => ({ ...prev, trainingReceived: updated }))
                  }}
                  disabled={!isFieldEditable("trainingReceived")}
                />
              </div>
              <div className="space-y-2">
                <Label>Programme</Label>
                <Input
                  value={training.programme}
                  onChange={(e) => {
                    const updated = [...(formData.trainingReceived || [])]
                    updated[index] = { ...updated[index], programme: e.target.value }
                    setFormData((prev) => ({ ...prev, trainingReceived: updated }))
                  }}
                  disabled={!isFieldEditable("trainingReceived")}
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeTrainingEntry(index)}
                  disabled={!isFieldEditable("trainingReceived")}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {(!formData.trainingReceived || formData.trainingReceived.length === 0) && (
            <p className="text-muted-foreground text-center py-4">No training entries added yet</p>
          )}
        </CardContent>
      </Card>

      {/* Section 2: Performance Planning Form */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>SECTION 2: Performance Planning Form</CardTitle>
            <Button onClick={addKeyResultArea} size="sm" disabled={!isFieldEditable("keyResultAreas")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Key Result Area
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            To be agreed between the appraiser and the employee at the start of the annual appraisal cycle or when a new
            employee is engaged.
          </p>

          {formData.keyResultAreas?.map((kra, index) => (
            <div key={kra.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label>Key Result Areas (Not more than 5)</Label>
                <Textarea
                  value={kra.area}
                  onChange={(e) => {
                    const updated = [...(formData.keyResultAreas || [])]
                    updated[index] = { ...updated[index], area: e.target.value }
                    setFormData((prev) => ({ ...prev, keyResultAreas: updated }))
                  }}
                  placeholder="To be drawn from employee's Job Description"
                  disabled={!isFieldEditable("keyResultAreas")}
                />
              </div>
              <div className="space-y-2">
                <Label>Targets</Label>
                <Textarea
                  value={kra.targets}
                  onChange={(e) => {
                    const updated = [...(formData.keyResultAreas || [])]
                    updated[index] = { ...updated[index], targets: e.target.value }
                    setFormData((prev) => ({ ...prev, keyResultAreas: updated }))
                  }}
                  placeholder="Results to be achieved, should be specific, measurable, realistic and time-framed"
                  disabled={!isFieldEditable("keyResultAreas")}
                />
              </div>
              <div className="space-y-2">
                <Label>Resources Required</Label>
                <Textarea
                  value={kra.resourcesRequired}
                  onChange={(e) => {
                    const updated = [...(formData.keyResultAreas || [])]
                    updated[index] = { ...updated[index], resourcesRequired: e.target.value }
                    setFormData((prev) => ({ ...prev, keyResultAreas: updated }))
                  }}
                  disabled={!isFieldEditable("keyResultAreas")}
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeKeyResultArea(index)}
                  disabled={!isFieldEditable("keyResultAreas")}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Section 3: Mid-Year Review */}
      <Card className="glass-card">
        <CardHeader style={{ backgroundColor: "#B45309", color: "white" }}>
          <CardTitle>SECTION 3: Mid-Year Review Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              This is to be completed in July by the Appraiser and Appraisee
            </p>
            <p className="text-sm text-blue-800 text-center mt-2">
              Progress has been discussed and Agreements have been reached as detailed below.
            </p>
          </div>

          <div className="space-y-6">
            {/* Mid-Year Targets Table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-center w-full">MID-YEAR REVIEW</h3>
                <Button onClick={addMidYearTarget} size="sm" disabled={!isFieldEditable("midYearReview", "targets")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Target
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-4 bg-gray-100 border-b">
                  <div className="p-3 border-r font-semibold text-center">NO.</div>
                  <div className="p-3 border-r font-semibold text-center">TARGET</div>
                  <div className="p-3 border-r font-semibold text-center">PROGRESS REVIEW</div>
                  <div className="p-3 font-semibold text-center">REMARKS</div>
                </div>

                {formData.midYearReview?.targets?.map((target, index) => (
                  <div key={index} className="grid grid-cols-4 border-b">
                    <div className="p-3 border-r text-center">{target.no}</div>
                    <div className="p-3 border-r">
                      <Textarea
                        value={target.target}
                        onChange={(e) => {
                          const updated = [...(formData.midYearReview?.targets || [])]
                          updated[index] = { ...updated[index], target: e.target.value }
                          setFormData((prev) => ({
                            ...prev,
                            midYearReview: { ...prev.midYearReview!, targets: updated },
                          }))
                        }}
                        className="min-h-[60px]"
                        disabled={!isFieldEditable("midYearReview", "targets")}
                      />
                    </div>
                    <div className="p-3 border-r">
                      <Textarea
                        value={target.progressReview}
                        onChange={(e) => {
                          const updated = [...(formData.midYearReview?.targets || [])]
                          updated[index] = { ...updated[index], progressReview: e.target.value }
                          setFormData((prev) => ({
                            ...prev,
                            midYearReview: { ...prev.midYearReview!, targets: updated },
                          }))
                        }}
                        className="min-h-[60px]"
                        disabled={!isFieldEditable("midYearReview", "targets")}
                      />
                    </div>
                    <div className="p-3 flex items-start space-x-2">
                      <Textarea
                        value={target.remarks}
                        onChange={(e) => {
                          const updated = [...(formData.midYearReview?.targets || [])]
                          updated[index] = { ...updated[index], remarks: e.target.value }
                          setFormData((prev) => ({
                            ...prev,
                            midYearReview: { ...prev.midYearReview!, targets: updated },
                          }))
                        }}
                        className="min-h-[60px] flex-1"
                        disabled={!isFieldEditable("midYearReview", "targets")}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeMidYearTarget(index)}
                        disabled={!isFieldEditable("midYearReview", "targets")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mid-Year Competencies Table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Button
                  onClick={addMidYearCompetency}
                  size="sm"
                  disabled={!isFieldEditable("midYearReview", "competencies")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Competency
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-4 bg-gray-100 border-b">
                  <div className="p-3 border-r font-semibold text-center">NO.</div>
                  <div className="p-3 border-r font-semibold text-center">COMPETENCY</div>
                  <div className="p-3 border-r font-semibold text-center">PROGRESS REVIEW</div>
                  <div className="p-3 font-semibold text-center">REMARKS</div>
                </div>

                {formData.midYearReview?.competencies?.map((competency, index) => (
                  <div key={index} className="grid grid-cols-4 border-b">
                    <div className="p-3 border-r text-center">{competency.no}</div>
                    <div className="p-3 border-r">
                      <Textarea
                        value={competency.competency}
                        onChange={(e) => {
                          const updated = [...(formData.midYearReview?.competencies || [])]
                          updated[index] = { ...updated[index], competency: e.target.value }
                          setFormData((prev) => ({
                            ...prev,
                            midYearReview: { ...prev.midYearReview!, competencies: updated },
                          }))
                        }}
                        className="min-h-[60px]"
                        disabled={!isFieldEditable("midYearReview", "competencies")}
                      />
                    </div>
                    <div className="p-3 border-r">
                      <Textarea
                        value={competency.progressReview}
                        onChange={(e) => {
                          const updated = [...(formData.midYearReview?.competencies || [])]
                          updated[index] = { ...updated[index], progressReview: e.target.value }
                          setFormData((prev) => ({
                            ...prev,
                            midYearReview: { ...prev.midYearReview!, competencies: updated },
                          }))
                        }}
                        className="min-h-[60px]"
                        disabled={!isFieldEditable("midYearReview", "competencies")}
                      />
                    </div>
                    <div className="p-3 flex items-start space-x-2">
                      <Textarea
                        value={competency.remarks}
                        onChange={(e) => {
                          const updated = [...(formData.midYearReview?.competencies || [])]
                          updated[index] = { ...updated[index], remarks: e.target.value }
                          setFormData((prev) => ({
                            ...prev,
                            midYearReview: { ...prev.midYearReview!, competencies: updated },
                          }))
                        }}
                        className="min-h-[60px] flex-1"
                        disabled={!isFieldEditable("midYearReview", "competencies")}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeMidYearCompetency(index)}
                        disabled={!isFieldEditable("midYearReview", "competencies")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mid-Year Signatures */}
            <div className="grid grid-cols-2 gap-8 mt-8">
              <div className="space-y-4">
                <div className="bg-orange-600 text-white p-3 text-center font-semibold">APPRAISEE'S SIGNATURE</div>
                <Input
                  value={formData.midYearReview?.appraiseeSignature || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      midYearReview: { ...prev.midYearReview!, appraiseeSignature: e.target.value },
                    }))
                  }
                  disabled={!isFieldEditable("midYearReview", "signatures")}
                />
                <div className="bg-orange-600 text-white p-3 text-center font-semibold">DATE (dd/mm/yyyy)</div>
                <Input
                  type="date"
                  value={formData.midYearReview?.appraiseeDate || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      midYearReview: { ...prev.midYearReview!, appraiseeDate: e.target.value },
                    }))
                  }
                  disabled={!isFieldEditable("midYearReview", "signatures")}
                />
              </div>
              <div className="space-y-4">
                <div className="bg-orange-600 text-white p-3 text-center font-semibold">APPRAISER'S SIGNATURE</div>
                <Input
                  value={formData.midYearReview?.appraiserSignature || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      midYearReview: { ...prev.midYearReview!, appraiserSignature: e.target.value },
                    }))
                  }
                  disabled={!isFieldEditable("midYearReview", "signatures")}
                />
                <div className="bg-orange-600 text-white p-3 text-center font-semibold">DATE (dd/mm/yyyy)</div>
                <Input
                  type="date"
                  value={formData.midYearReview?.appraiserDate || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      midYearReview: { ...prev.midYearReview!, appraiserDate: e.target.value },
                    }))
                  }
                  disabled={!isFieldEditable("midYearReview", "signatures")}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: End-of-Year Review Form */}
      <Card className="glass-card">
        <CardHeader style={{ backgroundColor: "#B45309", color: "white" }}>
          <CardTitle>SECTION 4: End-of-Year Review Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              This is to be completed in December by the Appraiser and Appraisee.
            </p>
            <p className="text-sm text-blue-800 text-center mt-2">
              ■ Please refer to <strong>page 8</strong> of the manual for guidance to the scoring.
            </p>
          </div>

          <div className="space-y-6">
            {/* End-of-Year Targets Table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-center w-full">END-OF-YEAR REVIEW FORM</h3>
                <Button onClick={addEndYearTarget} size="sm" disabled={!isFieldEditable("endOfYearReview", "targets")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Target
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-6 bg-gray-100 border-b">
                  <div className="p-3 border-r font-semibold text-center">NO.</div>
                  <div className="p-3 border-r font-semibold text-center">TARGET</div>
                  <div className="p-3 border-r font-semibold text-center">PERFORMANCE ASSESSMENT</div>
                  <div className="p-3 border-r font-semibold text-center">WEIGHT OF TARGET</div>
                  <div className="p-3 border-r font-semibold text-center">SCORE</div>
                  <div className="p-3 font-semibold text-center">COMMENTS</div>
                </div>

                {formData.endOfYearReview?.targets?.map((target, index) => (
                  <div key={index} className="grid grid-cols-6 border-b">
                    <div className="p-3 border-r text-center">{target.no}</div>
                    <div className="p-3 border-r">
                      <Textarea
                        value={target.target}
                        onChange={(e) => {
                          const updated = [...(formData.endOfYearReview?.targets || [])]
                          updated[index] = { ...updated[index], target: e.target.value }
                          setFormData((prev) => ({
                            ...prev,
                            endOfYearReview: { ...prev.endOfYearReview!, targets: updated },
                          }))
                        }}
                        className="min-h-[60px]"
                        disabled={!isFieldEditable("endOfYearReview", "targets")}
                      />
                    </div>
                    <div className="p-3 border-r">
                      <Textarea
                        value={target.performanceAssessment}
                        onChange={(e) => {
                          const updated = [...(formData.endOfYearReview?.targets || [])]
                          updated[index] = { ...updated[index], performanceAssessment: e.target.value }
                          setFormData((prev) => ({
                            ...prev,
                            endOfYearReview: { ...prev.endOfYearReview!, targets: updated },
                          }))
                        }}
                        className="min-h-[60px]"
                        disabled={!isFieldEditable("endOfYearReview", "targets")}
                      />
                    </div>
                    <div className="p-3 border-r text-center">
                      <Input
                        type="number"
                        value={target.weightOfTarget}
                        onChange={(e) => {
                          const updated = [...(formData.endOfYearReview?.targets || [])]
                          updated[index] = { ...updated[index], weightOfTarget: Number.parseInt(e.target.value) || 5 }
                          setFormData((prev) => ({
                            ...prev,
                            endOfYearReview: { ...prev.endOfYearReview!, targets: updated },
                          }))
                        }}
                        className="text-center"
                        disabled={!isFieldEditable("endOfYearReview", "targets")}
                      />
                    </div>
                    <div className="p-3 border-r">
                      <Input
                        type="number"
                        min="1"
                        max="5"
                        value={target.score}
                        onChange={(e) => {
                          const updated = [...(formData.endOfYearReview?.targets || [])]
                          updated[index] = { ...updated[index], score: Number.parseInt(e.target.value) || 0 }
                          setFormData((prev) => ({
                            ...prev,
                            endOfYearReview: { ...prev.endOfYearReview!, targets: updated },
                          }))
                          calculateEndYearTotals()
                        }}
                        className="text-center"
                        disabled={!isFieldEditable("endOfYearReview", "targets")}
                      />
                    </div>
                    <div className="p-3 flex items-start space-x-2">
                      <Textarea
                        value={target.comments}
                        onChange={(e) => {
                          const updated = [...(formData.endOfYearReview?.targets || [])]
                          updated[index] = { ...updated[index], comments: e.target.value }
                          setFormData((prev) => ({
                            ...prev,
                            endOfYearReview: { ...prev.endOfYearReview!, targets: updated },
                          }))
                        }}
                        className="min-h-[60px] flex-1"
                        disabled={!isFieldEditable("endOfYearReview", "targets")}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeEndYearTarget(index)}
                        disabled={!isFieldEditable("endOfYearReview", "targets")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Calculation Rows */}
                <div className="grid grid-cols-6 border-b bg-gray-50">
                  <div className="p-3 border-r"></div>
                  <div className="p-3 border-r"></div>
                  <div className="p-3 border-r"></div>
                  <div className="p-3 border-r font-semibold text-center">TOTAL (Q)</div>
                  <div className="p-3 border-r text-center font-semibold">
                    = {formData.endOfYearReview?.totalScore || 0}
                  </div>
                  <div className="p-3"></div>
                </div>
                <div className="grid grid-cols-6 border-b bg-gray-50">
                  <div className="p-3 border-r"></div>
                  <div className="p-3 border-r"></div>
                  <div className="p-3 border-r"></div>
                  <div className="p-3 border-r font-semibold text-center">(A) AVERAGE (Q/n)</div>
                  <div className="p-3 border-r text-center font-semibold">
                    = {formData.endOfYearReview?.averageScore?.toFixed(2) || 0}
                  </div>
                  <div className="p-3"></div>
                </div>
                <div className="grid grid-cols-6 border-b bg-gray-50">
                  <div className="p-3 border-r"></div>
                  <div className="p-3 border-r"></div>
                  <div className="p-3 border-r"></div>
                  <div className="p-3 border-r font-semibold text-center">(M) = (A) × 0.6</div>
                  <div className="p-3 border-r text-center font-semibold">
                    = {formData.endOfYearReview?.weightedScore?.toFixed(2) || 0}
                  </div>
                  <div className="p-3"></div>
                </div>
              </div>
            </div>

            {/* End-of-Year Signatures */}
            <div className="grid grid-cols-2 gap-8 mt-8">
              <div className="space-y-4">
                <div className="bg-orange-600 text-white p-3 text-center font-semibold">APPRAISEE'S SIGNATURE</div>
                <Input
                  value={formData.endOfYearReview?.appraiseeSignature || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endOfYearReview: { ...prev.endOfYearReview!, appraiseeSignature: e.target.value },
                    }))
                  }
                  disabled={!isFieldEditable("endOfYearReview", "signatures")}
                />
                <div className="bg-orange-600 text-white p-3 text-center font-semibold">DATE (dd/mm/yyyy)</div>
                <Input
                  type="date"
                  value={formData.endOfYearReview?.appraiseeDate || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endOfYearReview: { ...prev.endOfYearReview!, appraiseeDate: e.target.value },
                    }))
                  }
                  disabled={!isFieldEditable("endOfYearReview", "signatures")}
                />
              </div>
              <div className="space-y-4">
                <div className="bg-orange-600 text-white p-3 text-center font-semibold">APPRAISER'S SIGNATURE</div>
                <Input
                  value={formData.endOfYearReview?.appraiserSignature || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endOfYearReview: { ...prev.endOfYearReview!, appraiserSignature: e.target.value },
                    }))
                  }
                  disabled={!isFieldEditable("endOfYearReview", "signatures")}
                />
                <div className="bg-orange-600 text-white p-3 text-center font-semibold">DATE (dd/mm/yyyy)</div>
                <Input
                  type="date"
                  value={formData.endOfYearReview?.appraiserDate || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endOfYearReview: { ...prev.endOfYearReview!, appraiserDate: e.target.value },
                    }))
                  }
                  disabled={!isFieldEditable("endOfYearReview", "signatures")}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core Competencies - Only visible to appraiser */}
      {isFieldVisible("coreCompetencies") && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>SECTION 5: Core Competencies Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">{/* ... existing core competencies fields ... */}</CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        {mode !== "view" && (
          <>
            <Button variant="outline" onClick={handleSave} disabled={!isFieldEditable("actionButtons")}>
              Save Draft
            </Button>
            <Button onClick={handleSubmit} disabled={!isFieldEditable("actionButtons")}>
              {mode === "appraisee" ? "Submit for Review" : "Submit Appraisal"}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
