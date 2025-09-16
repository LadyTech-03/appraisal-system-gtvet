"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAppStore, useAuthStore } from "@/lib/store"
import type { Appraisal } from "@/lib/types"
import { Plus, Minus, Save, Send, FileText, Target, Star, BookOpen } from "lucide-react"
import { MidYearReviewSection } from "./mid-year-review-section"
import { EndYearReviewSection } from "./end-year-review-section"

interface AppraisalFormProps {
  appraisal?: Appraisal
  employeeId?: string
  onSave?: (appraisal: Partial<Appraisal>) => void
  onSubmit?: (appraisal: Partial<Appraisal>) => void
  readOnly?: boolean
}

export function AppraisalForm({ appraisal, employeeId, onSave, onSubmit, readOnly = false }: AppraisalFormProps) {
  const { user } = useAuthStore()
  const { users, addAppraisal, updateAppraisal } = useAppStore()

  const employee = employeeId
    ? users.find((u) => u.id === employeeId)
    : users.find((u) => u.id === appraisal?.employeeId)

  const [formData, setFormData] = useState<Partial<Appraisal>>({
    employeeId: employeeId || appraisal?.employeeId || "",
    appraiserId: user?.id || appraisal?.appraiserId || "",
    periodStart: appraisal?.periodStart || new Date().getFullYear() + "-01-01",
    periodEnd: appraisal?.periodEnd || new Date().getFullYear() + "-12-31",
    status: appraisal?.status || "draft",
    objectives: appraisal?.objectives || [{ id: "1", desc: "", target: "", achievement: 0 }],
    competencies: appraisal?.competencies || [
      { name: "Leadership", rating: 0, comment: "" },
      { name: "Communication", rating: 0, comment: "" },
      { name: "Problem Solving", rating: 0, comment: "" },
      { name: "Teamwork", rating: 0, comment: "" },
      { name: "Reliability", rating: 0, comment: "" },
    ],
    roleSkills: appraisal?.roleSkills || [
      { name: "Technical Competency", rating: 0 },
      { name: "Strategic Thinking", rating: 0 },
    ],
    trainingNeeds: appraisal?.trainingNeeds || [],
    overallRating: appraisal?.overallRating || 0,
    appraiserComments: appraisal?.appraiserComments || "",
    employeeComments: appraisal?.employeeComments || "",
    attachments: appraisal?.attachments || [],
    midYearReview: appraisal?.midYearReview || {
      targets: [{ id: "1", target: "", progressReview: "", remarks: "" }],
      competencies: [{ id: "1", competency: "", progressReview: "", remarks: "" }],
      reviewDate: "",
      appraiserSignature: "",
      appraiseeSignature: "",
    },
    endOfYearReview: appraisal?.endOfYearReview || {
      targets: [{ id: "1", target: "", performanceAssessment: "", weight: 5, score: 0, comments: "" }],
      totalScore: 0,
      averageScore: 0,
      weightedScore: 0,
    },
  })

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [newTrainingNeed, setNewTrainingNeed] = useState("")

  const handleSave = () => {
    try {
      if (appraisal?.id) {
        updateAppraisal(appraisal.id, formData)
        setMessage({ type: "success", text: "Appraisal saved as draft successfully!" })
      } else {
        const completeAppraisal = {
          ...formData,
          employeeInfo: {
            title: "Mr.",
            surname: employee?.name?.split(" ")[1] || "",
            firstName: employee?.name?.split(" ")[0] || "",
            otherNames: employee?.name?.split(" ").slice(2).join(" ") || "",
            gender: "Male" as const,
            grade: "Grade 15",
            position: employee?.role || "",
            department: employee?.division || "Management Services",
            appointmentDate: "2020-01-15",
          },
          appraiserInfo: {
            title: "Mr.",
            surname: user?.name?.split(" ")[1] || "",
            firstName: user?.name?.split(" ")[0] || "",
            otherNames: user?.name?.split(" ").slice(2).join(" ") || "",
            position: user?.role || "",
          },
          trainingReceived: [],
          keyResultAreas:
            formData.objectives?.map((obj) => ({
              id: obj.id,
              area: obj.desc,
              targets: obj.target,
              resourcesRequired: "Standard resources",
            })) || [],
          endOfYearReview: {
            targets: [],
            totalScore: 0,
            averageScore: 0,
            weightedScore: 0,
          },
          coreCompetencies: {
            organizationManagement: {
              planOrganizeWork: { weight: 0.3, score: 0 },
              workSystematically: { weight: 0.3, score: 0 },
              manageOthers: { weight: 0.3, score: 0 },
              total: 0,
              average: 0,
              comments: "",
            },
            innovationStrategicThinking: {
              supportChange: { weight: 0.3, score: 0 },
              thinkBroadly: { weight: 0.3, score: 0 },
              originalityThinking: { weight: 0.3, score: 0 },
              total: 0,
              average: 0,
              comments: "",
            },
            leadershipDecisionMaking: {
              initiateAction: { weight: 0.3, score: 0 },
              acceptResponsibility: { weight: 0.3, score: 0 },
              exerciseJudgment: { weight: 0.3, score: 0 },
              total: 0,
              average: 0,
              comments: "",
            },
            developingImproving: {
              organizationDevelopment: { weight: 0.3, score: 0 },
              customerSatisfaction: { weight: 0.3, score: 0 },
              personnelDevelopment: { weight: 0.3, score: 0 },
              total: 0,
              average: 0,
              comments: "",
            },
            communication: {
              communicateDecisions: { weight: 0.3, score: 0 },
              negotiateManageConflict: { weight: 0.3, score: 0 },
              relateNetwork: { weight: 0.3, score: 0 },
              total: 0,
              average: 0,
              comments: "",
            },
            jobKnowledgeTechnicalSkills: {
              mentalPhysicalSkills: { weight: 0.3, score: 0 },
              crossFunctionalAwareness: { weight: 0.3, score: 0 },
              buildingApplyingExpertise: { weight: 0.3, score: 0 },
              total: 0,
              average: 0,
              comments: "",
            },
            supportingCooperating: {
              workEffectively: { weight: 0.3, score: 0 },
              showSupport: { weight: 0.3, score: 0 },
              adhereEthics: { weight: 0.3, score: 0 },
              total: 0,
              average: 0,
              comments: "",
            },
            maximizingProductivity: {
              motivateInspire: { weight: 0.3, score: 0 },
              acceptChallenges: { weight: 0.3, score: 0 },
              managePressure: { weight: 0.3, score: 0 },
              total: 0,
              average: 0,
              comments: "",
            },
            budgetCostManagement: {
              financialAwareness: { weight: 0.3, score: 0 },
              businessProcesses: { weight: 0.3, score: 0 },
              resultBasedActions: { weight: 0.3, score: 0 },
              total: 0,
              average: 0,
              comments: "",
            },
            coreCompetenciesAverage: 0,
          },
          nonCoreCompetencies: {
            developStaff: {
              developOthers: { weight: 0.1, score: 0 },
              provideGuidance: { weight: 0.1, score: 0 },
              total: 0,
              average: 0,
            },
            personalDevelopment: {
              eagernessForDevelopment: { weight: 0.1, score: 0 },
              innerDrive: { weight: 0.1, score: 0 },
              total: 0,
              average: 0,
            },
            deliveringResults: {
              customerSatisfaction: { weight: 0.1, score: 0 },
              qualityService: { weight: 0.1, score: 0 },
              total: 0,
              average: 0,
            },
            followingInstructions: {
              regulations: { weight: 0.1, score: 0 },
              customerFeedback: { weight: 0.1, score: 0 },
              total: 0,
              average: 0,
            },
            respectCommitment: {
              respectSuperiors: { weight: 0.1, score: 0 },
              commitmentWork: { weight: 0.1, score: 0 },
              total: 0,
              average: 0,
            },
            teamWork: {
              functionInTeam: { weight: 0.1, score: 0 },
              workInTeam: { weight: 0.1, score: 0 },
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
            overallRating: formData.overallRating || 3,
            ratingDescription: "Met all Expectations",
          },
          trainingDevelopmentPlan: "",
          assessmentDecision: "suitable" as const,
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
        addAppraisal(completeAppraisal)
        setMessage({ type: "success", text: "Appraisal created successfully!" })
      }
      onSave?.(formData)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save appraisal. Please try again." })
    }
  }

  const handleSubmit = () => {
    try {
      const updatedData = { ...formData, status: "submitted" as const }
      if (appraisal?.id) {
        updateAppraisal(appraisal.id, updatedData)
      } else {
        const completeAppraisal = {
          ...updatedData,
          employeeInfo: {
            title: "Mr.",
            surname: employee?.name?.split(" ")[1] || "",
            firstName: employee?.name?.split(" ")[0] || "",
            otherNames: employee?.name?.split(" ").slice(2).join(" ") || "",
            gender: "Male" as const,
            grade: "Grade 15",
            position: employee?.role || "",
            department: employee?.division || "Management Services",
            appointmentDate: "2020-01-15",
          },
          appraiserInfo: {
            title: "Mr.",
            surname: user?.name?.split(" ")[1] || "",
            firstName: user?.name?.split(" ")[0] || "",
            otherNames: user?.name?.split(" ").slice(2).join(" ") || "",
            position: user?.role || "",
          },
          trainingReceived: [],
          keyResultAreas:
            updatedData.objectives?.map((obj) => ({
              id: obj.id,
              area: obj.desc,
              targets: obj.target,
              resourcesRequired: "Standard resources",
            })) || [],
          endOfYearReview: {
            targets: [],
            totalScore: 0,
            averageScore: 0,
            weightedScore: 0,
          },
          coreCompetencies: {
            organizationManagement: {
              planOrganizeWork: { weight: 0.3, score: 0 },
              workSystematically: { weight: 0.3, score: 0 },
              manageOthers: { weight: 0.3, score: 0 },
              total: 0,
              average: 0,
              comments: "",
            },
            innovationStrategicThinking: {
              supportChange: { weight: 0.3, score: 0 },
              thinkBroadly: { weight: 0.3, score: 0 },
              originalityThinking: { weight: 0.3, score: 0 },
              total: 0,
              average: 0,
              comments: "",
            },
            leadershipDecisionMaking: {
              initiateAction: { weight: 0.3, score: 0 },
              acceptResponsibility: { weight: 0.3, score: 0 },
              exerciseJudgment: { weight: 0.3, score: 0 },
              total: 0,
              average: 0,
              comments: "",
            },
            developingImproving: {
              organizationDevelopment: { weight: 0.3, score: 0 },
              customerSatisfaction: { weight: 0.3, score: 0 },
              personnelDevelopment: { weight: 0.3, score: 0 },
              total: 0,
              average: 0,
              comments: "",
            },
            communication: {
              communicateDecisions: { weight: 0.3, score: 0 },
              negotiateManageConflict: { weight: 0.3, score: 0 },
              relateNetwork: { weight: 0.3, score: 0 },
              total: 0,
              average: 0,
              comments: "",
            },
            jobKnowledgeTechnicalSkills: {
              mentalPhysicalSkills: { weight: 0.3, score: 0 },
              crossFunctionalAwareness: { weight: 0.3, score: 0 },
              buildingApplyingExpertise: { weight: 0.3, score: 0 },
              total: 0,
              average: 0,
              comments: "",
            },
            supportingCooperating: {
              workEffectively: { weight: 0.3, score: 0 },
              showSupport: { weight: 0.3, score: 0 },
              adhereEthics: { weight: 0.3, score: 0 },
              total: 0,
              average: 0,
              comments: "",
            },
            maximizingProductivity: {
              motivateInspire: { weight: 0.3, score: 0 },
              acceptChallenges: { weight: 0.3, score: 0 },
              managePressure: { weight: 0.3, score: 0 },
              total: 0,
              average: 0,
              comments: "",
            },
            budgetCostManagement: {
              financialAwareness: { weight: 0.3, score: 0 },
              businessProcesses: { weight: 0.3, score: 0 },
              resultBasedActions: { weight: 0.3, score: 0 },
              total: 0,
              average: 0,
              comments: "",
            },
            coreCompetenciesAverage: 0,
          },
          nonCoreCompetencies: {
            developStaff: {
              developOthers: { weight: 0.1, score: 0 },
              provideGuidance: { weight: 0.1, score: 0 },
              total: 0,
              average: 0,
            },
            personalDevelopment: {
              eagernessForDevelopment: { weight: 0.1, score: 0 },
              innerDrive: { weight: 0.1, score: 0 },
              total: 0,
              average: 0,
            },
            deliveringResults: {
              customerSatisfaction: { weight: 0.1, score: 0 },
              qualityService: { weight: 0.1, score: 0 },
              total: 0,
              average: 0,
            },
            followingInstructions: {
              regulations: { weight: 0.1, score: 0 },
              customerFeedback: { weight: 0.1, score: 0 },
              total: 0,
              average: 0,
            },
            respectCommitment: {
              respectSuperiors: { weight: 0.1, score: 0 },
              commitmentWork: { weight: 0.1, score: 0 },
              total: 0,
              average: 0,
            },
            teamWork: {
              functionInTeam: { weight: 0.1, score: 0 },
              workInTeam: { weight: 0.1, score: 0 },
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
            overallRating: updatedData.overallRating || 3,
            ratingDescription: "Met all Expectations",
          },
          trainingDevelopmentPlan: "",
          assessmentDecision: "suitable" as const,
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
        addAppraisal(completeAppraisal)
      }
      setMessage({ type: "success", text: "Appraisal submitted for review!" })
      onSubmit?.(updatedData)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to submit appraisal. Please try again." })
    }
  }

  const addObjective = () => {
    const newObjective = {
      id: Date.now().toString(),
      desc: "",
      target: "",
      achievement: 0,
    }
    setFormData((prev) => ({
      ...prev,
      objectives: [...(prev.objectives || []), newObjective],
    }))
  }

  const removeObjective = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      objectives: prev.objectives?.filter((obj) => obj.id !== id) || [],
    }))
  }

  const updateObjective = (id: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      objectives: prev.objectives?.map((obj) => (obj.id === id ? { ...obj, [field]: value } : obj)) || [],
    }))
  }

  const updateCompetency = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      competencies: prev.competencies?.map((comp, i) => (i === index ? { ...comp, [field]: value } : comp)) || [],
    }))
  }

  const addRoleSkill = () => {
    const newSkill = {
      name: "",
      rating: 0,
    }
    setFormData((prev) => ({
      ...prev,
      roleSkills: [...(prev.roleSkills || []), newSkill],
    }))
  }

  const removeRoleSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      roleSkills: prev.roleSkills?.filter((_, i) => i !== index) || [],
    }))
  }

  const updateRoleSkill = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      roleSkills: prev.roleSkills?.map((skill, i) => (i === index ? { ...skill, [field]: value } : skill)) || [],
    }))
  }

  const addTrainingNeed = () => {
    if (newTrainingNeed.trim()) {
      setFormData((prev) => ({
        ...prev,
        trainingNeeds: [...(prev.trainingNeeds || []), newTrainingNeed.trim()],
      }))
      setNewTrainingNeed("")
    }
  }

  const removeTrainingNeed = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      trainingNeeds: prev.trainingNeeds?.filter((_, i) => i !== index) || [],
    }))
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600"
    if (rating >= 3) return "text-blue-600"
    if (rating >= 2) return "text-orange-600"
    return "text-red-600"
  }

  const getRatingText = (rating: number) => {
    if (rating >= 4) return "Excellent"
    if (rating >= 3) return "Good"
    if (rating >= 2) return "Satisfactory"
    if (rating >= 1) return "Needs Improvement"
    return "Not Rated"
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>Performance Appraisal</span>
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {employee?.name} - {employee?.role}
              </p>
            </div>
            <Badge variant={formData.status === "draft" ? "secondary" : "default"}>
              {formData.status?.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="periodStart">Period Start</Label>
              <Input
                id="periodStart"
                type="date"
                value={formData.periodStart}
                onChange={(e) => setFormData((prev) => ({ ...prev, periodStart: e.target.value }))}
                disabled={readOnly}
              />
            </div>
            <div>
              <Label htmlFor="periodEnd">Period End</Label>
              <Input
                id="periodEnd"
                type="date"
                value={formData.periodEnd}
                onChange={(e) => setFormData((prev) => ({ ...prev, periodEnd: e.target.value }))}
                disabled={readOnly}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Objectives & KPIs */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-primary" />
            <span>Objectives & KPIs</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.objectives?.map((objective, index) => (
            <div key={objective.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Objective {index + 1}</h4>
                {!readOnly && formData.objectives && formData.objectives.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeObjective(objective.id)}
                    className="text-destructive"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={objective.desc}
                    onChange={(e) => updateObjective(objective.id, "desc", e.target.value)}
                    placeholder="Describe the objective..."
                    disabled={readOnly}
                  />
                </div>
                <div>
                  <Label>Target</Label>
                  <Input
                    value={objective.target}
                    onChange={(e) => updateObjective(objective.id, "target", e.target.value)}
                    placeholder="Define the target outcome..."
                    disabled={readOnly}
                  />
                </div>
                <div>
                  <Label>Achievement (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={objective.achievement}
                    onChange={(e) => updateObjective(objective.id, "achievement", Number.parseInt(e.target.value) || 0)}
                    disabled={readOnly}
                  />
                </div>
              </div>
            </div>
          ))}
          {!readOnly && (
            <Button variant="outline" onClick={addObjective} className="w-full bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              Add Objective
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Core Competencies */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-primary" />
            <span>Core Competencies</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.competencies?.map((competency, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{competency.name}</h4>
                <Badge className={getRatingColor(competency.rating)}>{getRatingText(competency.rating)}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Rating (1-5)</Label>
                  <Select
                    value={competency.rating.toString()}
                    onValueChange={(value) => updateCompetency(index, "rating", Number.parseInt(value))}
                    disabled={readOnly}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Not Rated</SelectItem>
                      <SelectItem value="1">1 - Needs Improvement</SelectItem>
                      <SelectItem value="2">2 - Satisfactory</SelectItem>
                      <SelectItem value="3">3 - Good</SelectItem>
                      <SelectItem value="4">4 - Very Good</SelectItem>
                      <SelectItem value="5">5 - Excellent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Comments</Label>
                  <Textarea
                    value={competency.comment || ""}
                    onChange={(e) => updateCompetency(index, "comment", e.target.value)}
                    placeholder="Add comments..."
                    disabled={readOnly}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Role-Specific Skills */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>Section 3: Role-Specific Skills</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.roleSkills?.map((skill, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Skill {index + 1}</h4>
                {!readOnly && formData.roleSkills && formData.roleSkills.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => removeRoleSkill(index)} className="text-destructive">
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Skill Name</Label>
                  <Input
                    value={skill.name}
                    onChange={(e) => updateRoleSkill(index, "name", e.target.value)}
                    placeholder="Enter skill name..."
                    disabled={readOnly}
                  />
                </div>
                <div>
                  <Label>Rating (1-5)</Label>
                  <Select
                    value={skill.rating.toString()}
                    onValueChange={(value) => updateRoleSkill(index, "rating", Number.parseInt(value))}
                    disabled={readOnly}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Not Rated</SelectItem>
                      <SelectItem value="1">1 - Needs Improvement</SelectItem>
                      <SelectItem value="2">2 - Satisfactory</SelectItem>
                      <SelectItem value="3">3 - Good</SelectItem>
                      <SelectItem value="4">4 - Very Good</SelectItem>
                      <SelectItem value="5">5 - Excellent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
          {!readOnly && (
            <Button variant="outline" onClick={addRoleSkill} className="w-full bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Training Needs */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>Section 4: Training Needs</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {formData.trainingNeeds?.map((need, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded bg-gray-50/50">
                <span>{need}</span>
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTrainingNeed(index)}
                    className="text-destructive"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          {!readOnly && (
            <div className="flex space-x-2">
              <Input
                value={newTrainingNeed}
                onChange={(e) => setNewTrainingNeed(e.target.value)}
                placeholder="Add training need..."
                onKeyPress={(e) => e.key === "Enter" && addTrainingNeed()}
              />
              <Button onClick={addTrainingNeed}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <MidYearReviewSection
        data={formData.midYearReview}
        onChange={(data) => setFormData((prev) => ({ ...prev, midYearReview: data }))}
        readOnly={readOnly}
      />

      <EndYearReviewSection
        data={formData.endOfYearReview}
        onChange={(data) => setFormData((prev) => ({ ...prev, endOfYearReview: data }))}
        readOnly={readOnly}
      />

      {/* Overall Rating & Comments */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Overall Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Overall Rating (1-5)</Label>
            <Select
              value={formData.overallRating?.toString() || "0"}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, overallRating: Number.parseInt(value) }))}
              disabled={readOnly}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Not Rated</SelectItem>
                <SelectItem value="1">1 - Needs Improvement</SelectItem>
                <SelectItem value="2">2 - Satisfactory</SelectItem>
                <SelectItem value="3">Good</SelectItem>
                <SelectItem value="4">Very Good</SelectItem>
                <SelectItem value="5">Excellent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Appraiser Comments</Label>
            <Textarea
              value={formData.appraiserComments || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, appraiserComments: e.target.value }))}
              placeholder="Add your comments as the appraiser..."
              rows={4}
              disabled={readOnly}
            />
          </div>

          <div>
            <Label>Employee Comments</Label>
            <Textarea
              value={formData.employeeComments || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, employeeComments: e.target.value }))}
              placeholder="Add your comments as the employee..."
              rows={4}
              disabled={readOnly || user?.id !== formData.employeeId}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {!readOnly && (
        <div className="flex space-x-4">
          <Button onClick={handleSave} variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save as Draft
          </Button>
          <Button onClick={handleSubmit} className="bg-primary">
            <Send className="h-4 w-4 mr-2" />
            Submit for Review
          </Button>
        </div>
      )}
    </div>
  )
}
