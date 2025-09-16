"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"
import type { Appraisal, User } from "@/lib/types"

interface AppraisalExportProps {
  appraisal: Appraisal
  employee: User
  appraiser: User
}

export function AppraisalExport({ appraisal, employee, appraiser }: AppraisalExportProps) {
  const componentRef = useRef<HTMLDivElement>(null)

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const handlePrint = () => {
    if (componentRef.current) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Appraisal_${employee.name.replace(/\s+/g, "_")}_${appraisal.periodStart}_${appraisal.periodEnd}</title>
              <style>
                @page {
                  size: A4;
                  margin: 0.5in;
                }
                body { 
                  font-family: Times, serif;
                  -webkit-print-color-adjust: exact;
                  color: black;
                  background: white;
                }
                .page-break { page-break-before: always; }
                .no-print { display: none !important; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid black; padding: 8px; text-align: left; }
                .bg-gray-100 { background-color: #f3f4f6; }
                .bg-gray-50 { background-color: #f9fafb; }
                .bg-red-600 { background-color: #dc2626; color: white; }
                .border-black { border-color: black; }
                .text-center { text-align: center; }
                .text-left { text-align: left; }
                .font-bold { font-weight: bold; }
                .text-xl { font-size: 1.25rem; }
                .text-lg { font-size: 1.125rem; }
                .text-sm { font-size: 0.875rem; }
                .text-xs { font-size: 0.75rem; }
                .p-2 { padding: 8px; }
                .p-3 { padding: 12px; }
                .p-4 { padding: 16px; }
                .p-8 { padding: 32px; }
                .space-y-2 > * + * { margin-top: 8px; }
                .space-y-4 > * + * { margin-top: 16px; }
                .space-y-6 > * + * { margin-top: 24px; }
                .grid { display: grid; }
                .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
                .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
                .gap-2 { gap: 8px; }
                .gap-4 { gap: 16px; }
                .gap-8 { gap: 32px; }
                .border-t { border-top: 1px solid black; }
                .border-b { border-bottom: 1px solid black; }
                .border-b-2 { border-bottom: 2px solid black; }
                .pb-1 { padding-bottom: 4px; }
                .pb-4 { padding-bottom: 16px; }
                .pt-2 { padding-top: 8px; }
                .mt-2 { margin-top: 8px; }
                .mt-4 { margin-top: 16px; }
                .mt-8 { margin-top: 32px; }
                .min-h-[100px] { min-height: 100px; }
                .inline-block { display: inline-block; }
                .px-4 { padding-left: 16px; padding-right: 16px; }
                .py-1 { padding-top: 4px; padding-bottom: 4px; }
                .align-top { vertical-align: top; }
                .italic { font-style: italic; }
              </style>
            </head>
            <body>
              ${componentRef.current.innerHTML}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
        printWindow.close()
      }
    }
  }

  const handleExportPDF = () => {
    handlePrint() // For now, use the same print functionality
  }

  return (
    <div className="space-y-4">
      {/* Export Controls */}
      <div className="flex justify-end space-x-2 no-print">
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button onClick={handleExportPDF}>
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>

      {/* Printable Content */}
      <div ref={componentRef} className="bg-white text-black p-8 space-y-6" style={{ fontFamily: "Times, serif" }}>
        {/* Header */}
        <div className="text-center space-y-2 border-b-2 border-black pb-4">
          <h1 className="text-xl font-bold">PUBLIC SERVICES PERFORMANCE MANAGEMENT</h1>
          <h2 className="text-lg font-semibold">(STAFF PERFORMANCE PLANNING, REVIEW AND APPRAISAL FORM)</h2>
          <div className="inline-block bg-red-600 text-white px-4 py-1 text-sm font-bold">STRICTLY CONFIDENTIAL</div>
        </div>

        {/* Section 1A: Appraisee Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold border-b border-black pb-1">SECTION 1-A: Appraisee Personal Information</h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Period of Report From:</strong> {formatDate(appraisal.periodStart)}
            </div>
            <div>
              <strong>To:</strong> {formatDate(appraisal.periodEnd)}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <strong>Title:</strong> {appraisal.employeeInfo?.title || ""}
            </div>
            <div>
              <strong>Surname:</strong> {appraisal.employeeInfo?.surname || ""}
            </div>
            <div>
              <strong>First Name:</strong> {appraisal.employeeInfo?.firstName || ""}
            </div>
            <div>
              <strong>Other Name(s):</strong> {appraisal.employeeInfo?.otherNames || ""}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <strong>Gender:</strong> {appraisal.employeeInfo?.gender || ""}
            </div>
            <div>
              <strong>Grade/Salary (p.a):</strong> {appraisal.employeeInfo?.grade || ""}
            </div>
            <div>
              <strong>Date of Appointment:</strong> {formatDate(appraisal.employeeInfo?.appointmentDate || "")}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Present Job Title/Position:</strong> {appraisal.employeeInfo?.position || ""}
            </div>
            <div>
              <strong>Department/Division:</strong> {appraisal.employeeInfo?.department || ""}
            </div>
          </div>
        </div>

        {/* Training Received */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold border-b border-black pb-1">TRAINING RECEIVED DURING THE PREVIOUS YEAR</h3>

          {appraisal.trainingReceived && appraisal.trainingReceived.length > 0 ? (
            <table className="w-full border-collapse border border-black text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black p-2 text-left">Institution</th>
                  <th className="border border-black p-2 text-left">Date (dd-mm-yyyy)</th>
                  <th className="border border-black p-2 text-left">Programme</th>
                </tr>
              </thead>
              <tbody>
                {appraisal.trainingReceived.map((training, index) => (
                  <tr key={index}>
                    <td className="border border-black p-2">{training.institution}</td>
                    <td className="border border-black p-2">{formatDate(training.date)}</td>
                    <td className="border border-black p-2">{training.programme}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm italic">No training recorded for this period.</p>
          )}
        </div>

        {/* Section 1B: Appraiser Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold border-b border-black pb-1">SECTION 1-B: Appraiser Information</h3>

          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <strong>Title:</strong> {appraisal.appraiserInfo?.title || ""}
            </div>
            <div>
              <strong>Surname:</strong> {appraisal.appraiserInfo?.surname || ""}
            </div>
            <div>
              <strong>First Name:</strong> {appraisal.appraiserInfo?.firstName || ""}
            </div>
            <div>
              <strong>Other Name(s):</strong> {appraisal.appraiserInfo?.otherNames || ""}
            </div>
          </div>

          <div className="text-sm">
            <strong>Position of Appraiser:</strong> {appraisal.appraiserInfo?.position || ""}
          </div>
        </div>

        {/* Page Break */}
        <div className="page-break"></div>

        {/* Section 2: Performance Planning Form */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold border-b border-black pb-1">SECTION 2: Performance Planning Form</h3>
          <p className="text-sm italic">
            To be agreed between the appraiser and the employee at the start of the annual appraisal cycle or when a new
            employee is engaged.
          </p>

          {appraisal.keyResultAreas && appraisal.keyResultAreas.length > 0 ? (
            <table className="w-full border-collapse border border-black text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black p-2 text-left">
                    KEY RESULT AREAS
                    <br />
                    (Not more than 5 - To be drawn from employee's Job Description)
                  </th>
                  <th className="border border-black p-2 text-left">
                    TARGETS
                    <br />
                    (Results to be achieved, should be specific, measurable, realistic and time-framed)
                  </th>
                  <th className="border border-black p-2 text-left">RESOURCES REQUIRED</th>
                </tr>
              </thead>
              <tbody>
                {appraisal.keyResultAreas.map((kra, index) => (
                  <tr key={kra.id}>
                    <td className="border border-black p-2 align-top">{kra.area}</td>
                    <td className="border border-black p-2 align-top">{kra.targets}</td>
                    <td className="border border-black p-2 align-top">{kra.resourcesRequired}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm italic">No key result areas defined.</p>
          )}

          <div className="mt-8 grid grid-cols-2 gap-8">
            <div className="text-center">
              <div className="border-t border-black pt-2">
                <strong>APPRAISEE'S SIGNATURE</strong>
                <br />
                <span className="text-sm">{appraisal.appraiseeSignature || ""}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-black pt-2">
                <strong>APPRAISER'S SIGNATURE</strong>
                <br />
                <span className="text-sm">{appraisal.appraiserSignature || ""}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Break */}
        <div className="page-break"></div>

        {/* Section 5: Core Competencies Assessment */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold border-b border-black pb-1">
            SECTION 5: Annual Appraisal - Assessment of Core Competencies
          </h3>

          <div className="text-xs space-y-2 bg-gray-50 p-3 border">
            <div>
              <strong>Rating Explanation:</strong>
            </div>
            <div>
              <strong>5 – Exceptional, exceeds expectations:</strong> Has consistently demonstrated this behavior
              competency and always encouraged others to do same. Four (4) or more examples can be evidenced to support
              this rating.
            </div>
            <div>
              <strong>4 – Exceeds Expectations:</strong> Has frequently demonstrated this behavior competency and
              sometimes encouraged others to do same. Three (3) or more examples can be evidenced to support this
              rating.
            </div>
            <div>
              <strong>3 – Meets Expectations:</strong> Has demonstrated this behavior competency and at least two (2)
              examples can be evidenced to support this rating.
            </div>
            <div>
              <strong>2 – Below Expectation:</strong> Has rarely demonstrated this behavior competency and two (2) or
              more examples can be evidenced to support this rating.
            </div>
            <div>
              <strong>1 – Unacceptable:</strong> Has not at all demonstrated this behavior competency and three (3) or
              more examples can be evidenced to support this rating.
            </div>
          </div>

          <table className="w-full border-collapse border border-black text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-2 text-left">A/. CORE COMPETENCIES</th>
                <th className="border border-black p-2 text-center">(W) weight</th>
                <th className="border border-black p-2 text-center">(S) Score on Scale</th>
                <th className="border border-black p-2 text-center">W × S</th>
                <th className="border border-black p-2 text-left">COMMENTS</th>
              </tr>
            </thead>
            <tbody>
              {/* Organization and Management */}
              <tr>
                <td className="border border-black p-2">
                  <strong>(i) Organisation and Management:</strong>
                  <br />• Ability to plan, organise and manage work load.
                  <br />• Ability to work systematically and maintain quality.
                  <br />• Ability to manage others to achieve shared goals.
                </td>
                <td className="border border-black p-2 text-center">
                  0.3
                  <br />
                  0.3
                  <br />
                  0.3
                </td>
                <td className="border border-black p-2 text-center">
                  {appraisal.coreCompetencies?.organizationManagement?.planOrganizeWork?.score || 0}
                  <br />
                  {appraisal.coreCompetencies?.organizationManagement?.workSystematically?.score || 0}
                  <br />
                  {appraisal.coreCompetencies?.organizationManagement?.manageOthers?.score || 0}
                </td>
                <td className="border border-black p-2 text-center">
                  {((appraisal.coreCompetencies?.organizationManagement?.planOrganizeWork?.score || 0) * 0.3).toFixed(
                    1,
                  )}
                  <br />
                  {((appraisal.coreCompetencies?.organizationManagement?.workSystematically?.score || 0) * 0.3).toFixed(
                    1,
                  )}
                  <br />
                  {((appraisal.coreCompetencies?.organizationManagement?.manageOthers?.score || 0) * 0.3).toFixed(1)}
                </td>
                <td className="border border-black p-2">
                  {appraisal.coreCompetencies?.organizationManagement?.comments || ""}
                  <br />
                  <strong>Total:</strong>{" "}
                  {appraisal.coreCompetencies?.organizationManagement?.total?.toFixed(1) || "0.0"}
                  <br />
                  <strong>Average:</strong>{" "}
                  {appraisal.coreCompetencies?.organizationManagement?.average?.toFixed(1) || "0.0"}
                </td>
              </tr>

              {/* Innovation and Strategic Thinking */}
              <tr>
                <td className="border border-black p-2">
                  <strong>(ii) Innovation and Strategic Thinking:</strong>
                  <br />• Support for organisational change
                  <br />• Ability to think broadly and demonstrate creativity.
                  <br />• Originality in thinking
                </td>
                <td className="border border-black p-2 text-center">
                  0.3
                  <br />
                  0.3
                  <br />
                  0.3
                </td>
                <td className="border border-black p-2 text-center">
                  {appraisal.coreCompetencies?.innovationStrategicThinking?.supportChange?.score || 0}
                  <br />
                  {appraisal.coreCompetencies?.innovationStrategicThinking?.thinkBroadly?.score || 0}
                  <br />
                  {appraisal.coreCompetencies?.innovationStrategicThinking?.originalityThinking?.score || 0}
                </td>
                <td className="border border-black p-2 text-center">
                  {((appraisal.coreCompetencies?.innovationStrategicThinking?.supportChange?.score || 0) * 0.3).toFixed(
                    1,
                  )}
                  <br />
                  {((appraisal.coreCompetencies?.innovationStrategicThinking?.thinkBroadly?.score || 0) * 0.3).toFixed(
                    1,
                  )}
                  <br />
                  {(
                    (appraisal.coreCompetencies?.innovationStrategicThinking?.originalityThinking?.score || 0) * 0.3
                  ).toFixed(1)}
                </td>
                <td className="border border-black p-2">
                  {appraisal.coreCompetencies?.innovationStrategicThinking?.comments || ""}
                  <br />
                  <strong>Total:</strong>{" "}
                  {appraisal.coreCompetencies?.innovationStrategicThinking?.total?.toFixed(1) || "0.0"}
                  <br />
                  <strong>Average:</strong>{" "}
                  {appraisal.coreCompetencies?.innovationStrategicThinking?.average?.toFixed(1) || "0.0"}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4 text-sm">
            <strong>
              Average of ALL averages for CORE COMPETENCES (N) ={" "}
              {appraisal.coreCompetencies?.coreCompetenciesAverage?.toFixed(2) || "0.00"}
            </strong>
          </div>
        </div>

        {/* Page Break */}
        <div className="page-break"></div>

        {/* Overall Assessment */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold border-b border-black pb-1">OVERALL ASSESSMENT</h3>

          <div className="grid grid-cols-1 gap-2 text-sm">
            <div>
              <strong>PERFORMANCE ASSESSMENT (M) = </strong>
              {appraisal.overallAssessment?.performanceScore?.toFixed(2) || "0.00"}
            </div>
            <div>
              <strong>CORE COMPETENCIES ASSESSMENT (N) = </strong>
              {appraisal.overallAssessment?.coreCompetenciesScore?.toFixed(2) || "0.00"}
            </div>
            <div>
              <strong>NON-CORE COMPETENCIES ASSESSMENT (O) = </strong>
              {appraisal.overallAssessment?.nonCoreCompetenciesScore?.toFixed(2) || "0.00"}
            </div>
            <div>
              <strong>OVERALL TOTAL = </strong>
              {appraisal.overallAssessment?.overallTotal?.toFixed(2) || "0.00"}
            </div>
            <div>
              <strong>OVERALL ASSESSMENT/SCORE (Z) = T/5 X 100 = </strong>
              {appraisal.overallAssessment?.overallPercentage?.toFixed(1) || "0.0"}%
            </div>
          </div>

          <table className="w-full border-collapse border border-black text-sm mt-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-2">Score</th>
                <th className="border border-black p-2">Rating</th>
                <th className="border border-black p-2">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-2">80% above</td>
                <td className="border border-black p-2">5</td>
                <td className="border border-black p-2">Exceptional, exceeded expectations</td>
              </tr>
              <tr>
                <td className="border border-black p-2">79-65%</td>
                <td className="border border-black p-2">4</td>
                <td className="border border-black p-2">Exceeded Expectations</td>
              </tr>
              <tr>
                <td className="border border-black p-2">64-50%</td>
                <td className="border border-black p-2">3</td>
                <td className="border border-black p-2">Met all Expectations</td>
              </tr>
              <tr>
                <td className="border border-black p-2">49-41%</td>
                <td className="border border-black p-2">2</td>
                <td className="border border-black p-2">Below Expectation</td>
              </tr>
              <tr>
                <td className="border border-black p-2">40% & below</td>
                <td className="border border-black p-2">1</td>
                <td className="border border-black p-2">Unacceptable</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 6: Appraiser Comments */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold border-b border-black pb-1">SECTION 6: Annual Appraisal (Continuation)</h3>

          <div className="space-y-4">
            <div>
              <strong>Appraiser's Comments on Performance Plan Achievements</strong>
              <div className="border border-black p-4 min-h-[100px] mt-2">{appraisal.appraiserComments || ""}</div>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-8">
              <div className="text-center">
                <div className="border-t border-black pt-2">
                  <strong>APPRAISER'S SIGNATURE</strong>
                  <br />
                  <span className="text-sm">{appraisal.appraiserSignature || ""}</span>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t border-black pt-2">
                  <strong>DATE (dd/mm/yyyy)</strong>
                  <br />
                  <span className="text-sm">{formatDate(appraisal.appraiserSignatureDate || "")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 7: Career Development */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold border-b border-black pb-1">SECTION 7: Career Development</h3>

          <div>
            <strong>Training and Development - Comments and Plan</strong>
            <div className="border border-black p-4 min-h-[100px] mt-2">{appraisal.trainingDevelopmentPlan || ""}</div>
          </div>
        </div>

        {/* Section 8: Assessment Decision */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold border-b border-black pb-1">SECTION 8: ASSESSMENT DECISION</h3>

          <div className="space-y-2 text-sm">
            <p>
              Assess the Appraisee's potential to perform the duties of the next grade, taking account of the assessment
              of performance in Section 5 above.
            </p>

            <div className="space-y-1">
              <div className={appraisal.assessmentDecision === "outstanding" ? "font-bold" : ""}>
                ☐ Outstanding – should be promoted as soon as possible (promotion out-of-turn, study visits,
                commendations, salary increments and etc.)
              </div>
              <div className={appraisal.assessmentDecision === "suitable" ? "font-bold" : ""}>
                ☐ Suitable for promotion (encourage through mentoring, coaching, training and etc.)
              </div>
              <div className={appraisal.assessmentDecision === "likely_ready" ? "font-bold" : ""}>
                ☐ Likely to be ready for promotion in 2 to 3 years (encourage through mentoring, coaching, training and
                etc)
              </div>
              <div className={appraisal.assessmentDecision === "not_ready" ? "font-bold" : ""}>
                ☐ Not ready for promotion for at least 3years (forfeit yearly increment, reassignment and etc.)
              </div>
              <div className={appraisal.assessmentDecision === "unlikely" ? "font-bold" : ""}>
                ☐ Unlikely to be promoted further: (apply sanctions: demotion, dismissal, removal and etc)
              </div>
            </div>
          </div>
        </div>

        {/* Section 9: Appraisee Comments */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold border-b border-black pb-1">SECTION 9: Appraisee's Comments</h3>

          <div className="border border-black p-4 min-h-[100px]">{appraisal.appraiseeComments || ""}</div>

          <div className="grid grid-cols-2 gap-8 mt-8">
            <div className="text-center">
              <div className="border-t border-black pt-2">
                <strong>APPRAISEE'S SIGNATURE</strong>
                <br />
                <span className="text-sm">{appraisal.appraiseeSignature || ""}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-black pt-2">
                <strong>DATE (dd/mm/yyyy)</strong>
                <br />
                <span className="text-sm">{formatDate(appraisal.appraiseeSignatureDate || "")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 10: HOD Comments */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold border-b border-black pb-1">
            SECTION 10: Head of Department's / Division's (HOD) Comments
          </h3>

          <div className="border border-black p-4 min-h-[100px]">{appraisal.hodComments || ""}</div>

          <div className="grid grid-cols-2 gap-8 mt-8">
            <div className="text-center">
              <div className="border-t border-black pt-2">
                <strong>NAME AND HOD'S SIGNATURE</strong>
                <br />
                <span className="text-sm">{appraisal.hodName || ""}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-black pt-2">
                <strong>DATE (dd/mm/yyyy)</strong>
                <br />
                <span className="text-sm">{formatDate(appraisal.hodDate || "")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs mt-8 border-t border-black pt-4">
          <strong>
            PUBLIC SERVICES COMMISSION ME-SPRAS01 &nbsp;&nbsp;&nbsp;&nbsp; STRICTLY CONFIDENTIAL
            &nbsp;&nbsp;&nbsp;&nbsp; PAGE 11 OF 11
          </strong>
        </div>
      </div>
    </div>
  )
}
