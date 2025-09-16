"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Minus, Calendar } from "lucide-react"

interface MidYearTarget {
  id: string
  target: string
  progressReview: string
  remarks: string
}

interface MidYearCompetency {
  id: string
  competency: string
  progressReview: string
  remarks: string
}

interface MidYearReviewData {
  targets: MidYearTarget[]
  competencies: MidYearCompetency[]
  reviewDate: string
  appraiserSignature: string
  appraiseeSignature: string
}

interface MidYearReviewSectionProps {
  data?: MidYearReviewData
  onChange?: (data: MidYearReviewData) => void
  readOnly?: boolean
}

export function MidYearReviewSection({ data, onChange, readOnly = false }: MidYearReviewSectionProps) {
  const [formData, setFormData] = useState<MidYearReviewData>({
    targets: data?.targets || [{ id: "1", target: "", progressReview: "", remarks: "" }],
    competencies: data?.competencies || [{ id: "1", competency: "", progressReview: "", remarks: "" }],
    reviewDate: data?.reviewDate || "",
    appraiserSignature: data?.appraiserSignature || "",
    appraiseeSignature: data?.appraiseeSignature || "",
  })

  const updateData = (newData: MidYearReviewData) => {
    setFormData(newData)
    onChange?.(newData)
  }

  const addTarget = () => {
    const newTarget: MidYearTarget = {
      id: Date.now().toString(),
      target: "",
      progressReview: "",
      remarks: "",
    }
    const newData = {
      ...formData,
      targets: [...formData.targets, newTarget],
    }
    updateData(newData)
  }

  const removeTarget = (id: string) => {
    const newData = {
      ...formData,
      targets: formData.targets.filter((target) => target.id !== id),
    }
    updateData(newData)
  }

  const updateTarget = (id: string, field: keyof MidYearTarget, value: string) => {
    const newData = {
      ...formData,
      targets: formData.targets.map((target) => (target.id === id ? { ...target, [field]: value } : target)),
    }
    updateData(newData)
  }

  const addCompetency = () => {
    const newCompetency: MidYearCompetency = {
      id: Date.now().toString(),
      competency: "",
      progressReview: "",
      remarks: "",
    }
    const newData = {
      ...formData,
      competencies: [...formData.competencies, newCompetency],
    }
    updateData(newData)
  }

  const removeCompetency = (id: string) => {
    const newData = {
      ...formData,
      competencies: formData.competencies.filter((comp) => comp.id !== id),
    }
    updateData(newData)
  }

  const updateCompetency = (id: string, field: keyof MidYearCompetency, value: string) => {
    const newData = {
      ...formData,
      competencies: formData.competencies.map((comp) => (comp.id === id ? { ...comp, [field]: value } : comp)),
    }
    updateData(newData)
  }

  return (
    <Card className="glass-card">
      <CardHeader className="bg-orange-600 text-white">
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>SECTION 3: Mid-Year Review Form</span>
        </CardTitle>
        <p className="text-orange-100 text-sm">This is to be completed in July by the Appraiser and Appraisee</p>
        <p className="text-orange-100 text-sm font-medium">
          Progress has been discussed and Agreements have been reached as detailed below.
        </p>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Mid-Year Review Header */}
        <div className="text-center">
          <h3 className="font-bold text-lg underline">MID-YEAR REVIEW</h3>
        </div>

        {/* Targets Table */}
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-400">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-400 p-2 text-left font-semibold w-16">NO.</th>
                  <th className="border border-gray-400 p-2 text-left font-semibold">TARGET</th>
                  <th className="border border-gray-400 p-2 text-left font-semibold">PROGRESS REVIEW</th>
                  <th className="border border-gray-400 p-2 text-left font-semibold">REMARKS</th>
                  {!readOnly && <th className="border border-gray-400 p-2 text-center font-semibold w-20">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {formData.targets.map((target, index) => (
                  <tr key={target.id}>
                    <td className="border border-gray-400 p-2 text-center">{index + 1}</td>
                    <td className="border border-gray-400 p-2">
                      {readOnly ? (
                        <div className="min-h-[60px] p-2">{target.target}</div>
                      ) : (
                        <Textarea
                          value={target.target}
                          onChange={(e) => updateTarget(target.id, "target", e.target.value)}
                          placeholder="Enter target..."
                          className="min-h-[60px] border-0 resize-none"
                        />
                      )}
                    </td>
                    <td className="border border-gray-400 p-2">
                      {readOnly ? (
                        <div className="min-h-[60px] p-2">{target.progressReview}</div>
                      ) : (
                        <Textarea
                          value={target.progressReview}
                          onChange={(e) => updateTarget(target.id, "progressReview", e.target.value)}
                          placeholder="Enter progress review..."
                          className="min-h-[60px] border-0 resize-none"
                        />
                      )}
                    </td>
                    <td className="border border-gray-400 p-2">
                      {readOnly ? (
                        <div className="min-h-[60px] p-2">{target.remarks}</div>
                      ) : (
                        <Textarea
                          value={target.remarks}
                          onChange={(e) => updateTarget(target.id, "remarks", e.target.value)}
                          placeholder="Enter remarks..."
                          className="min-h-[60px] border-0 resize-none"
                        />
                      )}
                    </td>
                    {!readOnly && (
                      <td className="border border-gray-400 p-2 text-center">
                        {formData.targets.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTarget(target.id)}
                            className="text-destructive"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!readOnly && (
            <Button variant="outline" onClick={addTarget} className="w-full bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              Add Target
            </Button>
          )}
        </div>

        {/* Competencies Table */}
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-400">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-400 p-2 text-left font-semibold w-16">NO.</th>
                  <th className="border border-gray-400 p-2 text-left font-semibold">COMPETENCY</th>
                  <th className="border border-gray-400 p-2 text-left font-semibold">PROGRESS REVIEW</th>
                  <th className="border border-gray-400 p-2 text-left font-semibold">REMARKS</th>
                  {!readOnly && <th className="border border-gray-400 p-2 text-center font-semibold w-20">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {formData.competencies.map((competency, index) => (
                  <tr key={competency.id}>
                    <td className="border border-gray-400 p-2 text-center">{index + 1}</td>
                    <td className="border border-gray-400 p-2">
                      {readOnly ? (
                        <div className="min-h-[60px] p-2">{competency.competency}</div>
                      ) : (
                        <Textarea
                          value={competency.competency}
                          onChange={(e) => updateCompetency(competency.id, "competency", e.target.value)}
                          placeholder="Enter competency..."
                          className="min-h-[60px] border-0 resize-none"
                        />
                      )}
                    </td>
                    <td className="border border-gray-400 p-2">
                      {readOnly ? (
                        <div className="min-h-[60px] p-2">{competency.progressReview}</div>
                      ) : (
                        <Textarea
                          value={competency.progressReview}
                          onChange={(e) => updateCompetency(competency.id, "progressReview", e.target.value)}
                          placeholder="Enter progress review..."
                          className="min-h-[60px] border-0 resize-none"
                        />
                      )}
                    </td>
                    <td className="border border-gray-400 p-2">
                      {readOnly ? (
                        <div className="min-h-[60px] p-2">{competency.remarks}</div>
                      ) : (
                        <Textarea
                          value={competency.remarks}
                          onChange={(e) => updateCompetency(competency.id, "remarks", e.target.value)}
                          placeholder="Enter remarks..."
                          className="min-h-[60px] border-0 resize-none"
                        />
                      )}
                    </td>
                    {!readOnly && (
                      <td className="border border-gray-400 p-2 text-center">
                        {formData.competencies.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCompetency(competency.id)}
                            className="text-destructive"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!readOnly && (
            <Button variant="outline" onClick={addCompetency} className="w-full bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              Add Competency
            </Button>
          )}
        </div>

        {/* Signatures Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="space-y-4">
            <div className="bg-orange-600 text-white p-3 text-center font-semibold">APPRAISEE'S SIGNATURE</div>
            <div className="border-2 border-gray-300 h-20 flex items-center justify-center">
              {readOnly ? (
                <span className="text-gray-600">{formData.appraiseeSignature || "Not signed"}</span>
              ) : (
                <Input
                  value={formData.appraiseeSignature}
                  onChange={(e) => updateData({ ...formData, appraiseeSignature: e.target.value })}
                  placeholder="Appraisee signature"
                  className="border-0 text-center"
                />
              )}
            </div>
            <div className="bg-orange-600 text-white p-2 text-center">
              <Label className="text-white">DATE (dd/mm/yyyy)</Label>
            </div>
            <div className="border-2 border-gray-300 p-2">
              {readOnly ? (
                <span>{formData.reviewDate}</span>
              ) : (
                <Input
                  type="date"
                  value={formData.reviewDate}
                  onChange={(e) => updateData({ ...formData, reviewDate: e.target.value })}
                  className="border-0"
                />
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-orange-600 text-white p-3 text-center font-semibold">APPRAISER'S SIGNATURE</div>
            <div className="border-2 border-gray-300 h-20 flex items-center justify-center">
              {readOnly ? (
                <span className="text-gray-600">{formData.appraiserSignature || "Not signed"}</span>
              ) : (
                <Input
                  value={formData.appraiserSignature}
                  onChange={(e) => updateData({ ...formData, appraiserSignature: e.target.value })}
                  placeholder="Appraiser signature"
                  className="border-0 text-center"
                />
              )}
            </div>
            <div className="bg-orange-600 text-white p-2 text-center">
              <Label className="text-white">DATE (dd/mm/yyyy)</Label>
            </div>
            <div className="border-2 border-gray-300 p-2">
              {readOnly ? (
                <span>{formData.reviewDate}</span>
              ) : (
                <Input
                  type="date"
                  value={formData.reviewDate}
                  onChange={(e) => updateData({ ...formData, reviewDate: e.target.value })}
                  className="border-0"
                />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-gray-600 mt-8 pt-4 border-t">
          <span>PUBLIC SERVICES COMMISSION ME-SPRAS01</span>
          <span>STRICTLY CONFIDENTIAL</span>
          <span>PAGE 5 OF 11</span>
        </div>
      </CardContent>
    </Card>
  )
}
