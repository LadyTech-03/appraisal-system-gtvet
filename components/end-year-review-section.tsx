"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Minus, FileText } from "lucide-react"

interface EndYearTarget {
  id: string
  target: string
  performanceAssessment: string
  weight: number
  score: number
  comments: string
}

interface EndYearReviewData {
  targets: EndYearTarget[]
  totalScore: number
  averageScore: number
  weightedScore: number
  appraiserSignature: string
  appraiseeSignature: string
  reviewDate: string
}

interface EndYearReviewSectionProps {
  data?: EndYearReviewData
  onChange?: (data: EndYearReviewData) => void
  readOnly?: boolean
}

export function EndYearReviewSection({ data, onChange, readOnly = false }: EndYearReviewSectionProps) {
  const [formData, setFormData] = useState<EndYearReviewData>({
    targets: data?.targets || [{ id: "1", target: "", performanceAssessment: "", weight: 5, score: 0, comments: "" }],
    totalScore: data?.totalScore || 0,
    averageScore: data?.averageScore || 0,
    weightedScore: data?.weightedScore || 0,
    appraiserSignature: data?.appraiserSignature || "",
    appraiseeSignature: data?.appraiseeSignature || "",
    reviewDate: data?.reviewDate || "",
  })

  const calculatedTotals = useMemo(() => {
    const total = formData.targets.reduce((sum, target) => sum + target.score, 0)
    const average = formData.targets.length > 0 ? total / formData.targets.length : 0
    const weighted = average * 0.6

    return {
      totalScore: total,
      averageScore: average,
      weightedScore: weighted,
    }
  }, [formData.targets])

  const updateData = (newData: Partial<EndYearReviewData>) => {
    const updatedData = {
      ...formData,
      ...newData,
      ...calculatedTotals,
    }
    setFormData(updatedData)
    onChange?.(updatedData)
  }

  const addTarget = () => {
    const newTarget: EndYearTarget = {
      id: Date.now().toString(),
      target: "",
      performanceAssessment: "",
      weight: 5,
      score: 0,
      comments: "",
    }
    updateData({
      targets: [...formData.targets, newTarget],
    })
  }

  const removeTarget = (id: string) => {
    updateData({
      targets: formData.targets.filter((target) => target.id !== id),
    })
  }

  const updateTarget = (id: string, field: keyof EndYearTarget, value: string | number) => {
    updateData({
      targets: formData.targets.map((target) => (target.id === id ? { ...target, [field]: value } : target)),
    })
  }

  return (
    <Card className="glass-card">
      <CardHeader className="bg-orange-600 text-white">
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>SECTION 4: End-of-Year Review Form</span>
        </CardTitle>
        <div className="space-y-1 text-orange-100 text-sm">
          <p>This is to be completed in December by the Appraiser and Appraisee.</p>
          <p>
            ■ Please refer to <strong>page 8</strong> of the manual for guidance to the scoring.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* End-of-Year Review Header */}
        <div className="text-center">
          <h3 className="font-bold text-lg underline">END-OF-YEAR REVIEW FORM</h3>
        </div>

        {/* Targets Table */}
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-400">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-400 p-2 text-left font-semibold w-16">NO.</th>
                  <th className="border border-gray-400 p-2 text-left font-semibold">TARGET</th>
                  <th className="border border-gray-400 p-2 text-left font-semibold">PERFORMANCE ASSESSMENT</th>
                  <th className="border border-gray-400 p-2 text-center font-semibold w-24">WEIGHT OF TARGET</th>
                  <th className="border border-gray-400 p-2 text-center font-semibold w-20">SCORE</th>
                  <th className="border border-gray-400 p-2 text-left font-semibold">COMMENTS</th>
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
                        <div className="min-h-[60px] p-2">{target.performanceAssessment}</div>
                      ) : (
                        <Textarea
                          value={target.performanceAssessment}
                          onChange={(e) => updateTarget(target.id, "performanceAssessment", e.target.value)}
                          placeholder="Enter performance assessment..."
                          className="min-h-[60px] border-0 resize-none"
                        />
                      )}
                    </td>
                    <td className="border border-gray-400 p-2 text-center">
                      {readOnly ? (
                        <span className="font-semibold">{target.weight}</span>
                      ) : (
                        <Input
                          type="number"
                          value={target.weight}
                          onChange={(e) => updateTarget(target.id, "weight", Number(e.target.value) || 5)}
                          className="border-0 text-center font-semibold"
                          min="1"
                          max="5"
                        />
                      )}
                    </td>
                    <td className="border border-gray-400 p-2 text-center">
                      {readOnly ? (
                        <span className="font-semibold">{target.score}</span>
                      ) : (
                        <Input
                          type="number"
                          value={target.score}
                          onChange={(e) => updateTarget(target.id, "score", Number(e.target.value) || 0)}
                          className="border-0 text-center font-semibold"
                          min="0"
                          max="5"
                          step="0.1"
                        />
                      )}
                    </td>
                    <td className="border border-gray-400 p-2">
                      {readOnly ? (
                        <div className="min-h-[60px] p-2">{target.comments}</div>
                      ) : (
                        <Textarea
                          value={target.comments}
                          onChange={(e) => updateTarget(target.id, "comments", e.target.value)}
                          placeholder="Enter comments..."
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

                {/* Calculation Rows */}
                <tr className="bg-gray-50">
                  <td className="border border-gray-400 p-2" colSpan={3}></td>
                  <td className="border border-gray-400 p-2 text-center font-semibold">TOTAL (Q)</td>
                  <td className="border border-gray-400 p-2 text-center font-semibold">=</td>
                  <td className="border border-gray-400 p-2 text-center font-semibold">
                    {calculatedTotals.totalScore.toFixed(1)}
                  </td>
                  {!readOnly && <td className="border border-gray-400 p-2"></td>}
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-400 p-2" colSpan={3}></td>
                  <td className="border border-gray-400 p-2 text-center font-semibold">(A) AVERAGE (Q/n)</td>
                  <td className="border border-gray-400 p-2 text-center font-semibold">=</td>
                  <td className="border border-gray-400 p-2 text-center font-semibold">
                    {calculatedTotals.averageScore.toFixed(1)}
                  </td>
                  {!readOnly && <td className="border border-gray-400 p-2"></td>}
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-400 p-2" colSpan={3}></td>
                  <td className="border border-gray-400 p-2 text-center font-semibold">(M) = (A) × 0.6</td>
                  <td className="border border-gray-400 p-2 text-center font-semibold">=</td>
                  <td className="border border-gray-400 p-2 text-center font-semibold">
                    {calculatedTotals.weightedScore.toFixed(1)}
                  </td>
                  {!readOnly && <td className="border border-gray-400 p-2"></td>}
                </tr>
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
                  onChange={(e) => updateData({ appraiseeSignature: e.target.value })}
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
                  onChange={(e) => updateData({ reviewDate: e.target.value })}
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
                  onChange={(e) => updateData({ appraiserSignature: e.target.value })}
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
                  onChange={(e) => updateData({ reviewDate: e.target.value })}
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
          <span>PAGE 6 OF 11</span>
        </div>
      </CardContent>
    </Card>
  )
}
