export interface User {
  id: string
  name: string
  staffId: string
  email?: string
  role: string
  managerId?: string
  division?: string
  region?: string
  passwordHash?: string // for local auth simulation
  createdAt: string
  updatedAt: string
}

export interface Appraisal {
  id: string
  employeeId: string
  appraiserId: string
  periodStart: string
  periodEnd: string
  status: "draft" | "pending-review" | "submitted" | "reviewed" | "closed"
  createdBy?: "appraisee" | "appraiser"

  // Section 1: Personal Information (auto-filled from user data)
  employeeInfo: {
    title: string
    surname: string
    firstName: string
    otherNames?: string
    gender: "Male" | "Female"
    grade: string
    position: string
    department: string
    appointmentDate: string
  }

  // Section 1B: Appraiser Information (auto-filled)
  appraiserInfo: {
    title: string
    surname: string
    firstName: string
    otherNames?: string
    position: string
  }

  // Training received during previous year
  trainingReceived: {
    institution: string
    date: string
    programme: string
  }[]

  // Section 2: Performance Planning
  keyResultAreas: {
    id: string
    area: string
    targets: string
    resourcesRequired: string
  }[]

  objectives?: {
    id: string
    desc: string
    target: string
    achievement: number
  }[]

  competencies?: {
    name: string
    rating: number
    comment: string
  }[]

  roleSkills?: {
    name: string
    rating: number
  }[]

  trainingNeeds?: string[]

  overallRating?: number
  appraiserComments?: string
  employeeComments?: string
  attachments?: string[]

  // Section 3: Mid-Year Review
  midYearReview?: {
    targets: {
      id: string
      target: string
      progressReview: string
      remarks: string
    }[]
    competencies: {
      id: string
      competency: string
      progressReview: string
      remarks: string
    }[]
    reviewDate: string
    appraiserSignature: string
    appraiseeSignature: string
  }

  // Section 4: End-of-Year Review
  endOfYearReview: {
    targets: {
      id: string
      target: string
      performanceAssessment: string
      weight: number
      score: number
      comments: string
    }[]
    totalScore: number
    averageScore: number
    weightedScore: number
  }

  // Section 5: Core Competencies Assessment
  coreCompetencies: {
    organizationManagement: {
      planOrganizeWork: { weight: number; score: number }
      workSystematically: { weight: number; score: number }
      manageOthers: { weight: number; score: number }
      total: number
      average: number
      comments: string
    }
    innovationStrategicThinking: {
      supportChange: { weight: number; score: number }
      thinkBroadly: { weight: number; score: number }
      originalityThinking: { weight: number; score: number }
      total: number
      average: number
      comments: string
    }
    leadershipDecisionMaking: {
      initiateAction: { weight: number; score: number }
      acceptResponsibility: { weight: number; score: number }
      exerciseJudgment: { weight: number; score: number }
      total: number
      average: number
      comments: string
    }
    developingImproving: {
      organizationDevelopment: { weight: number; score: number }
      customerSatisfaction: { weight: number; score: number }
      personnelDevelopment: { weight: number; score: number }
      total: number
      average: number
      comments: string
    }
    communication: {
      communicateDecisions: { weight: number; score: number }
      negotiateManageConflict: { weight: number; score: number }
      relateNetwork: { weight: number; score: number }
      total: number
      average: number
      comments: string
    }
    jobKnowledgeTechnicalSkills: {
      mentalPhysicalSkills: { weight: number; score: number }
      crossFunctionalAwareness: { weight: number; score: number }
      buildingApplyingExpertise: { weight: number; score: number }
      total: number
      average: number
      comments: string
    }
    supportingCooperating: {
      workEffectively: { weight: number; score: number }
      showSupport: { weight: number; score: number }
      adhereEthics: { weight: number; score: number }
      total: number
      average: number
      comments: string
    }
    maximizingProductivity: {
      motivateInspire: { weight: number; score: number }
      acceptChallenges: { weight: number; score: number }
      managePressure: { weight: number; score: number }
      total: number
      average: number
      comments: string
    }
    budgetCostManagement: {
      financialAwareness: { weight: number; score: number }
      businessProcesses: { weight: number; score: number }
      resultBasedActions: { weight: number; score: number }
      total: number
      average: number
      comments: string
    }
    coreCompetenciesAverage: number
  }

  // Non-Core Competencies
  nonCoreCompetencies: {
    developStaff: {
      developOthers: { weight: number; score: number }
      provideGuidance: { weight: number; score: number }
      total: number
      average: number
    }
    personalDevelopment: {
      eagernessForDevelopment: { weight: number; score: number }
      innerDrive: { weight: number; score: number }
      total: number
      average: number
    }
    deliveringResults: {
      customerSatisfaction: { weight: number; score: number }
      qualityService: { weight: number; score: number }
      total: number
      average: number
    }
    followingInstructions: {
      regulations: { weight: number; score: number }
      customerFeedback: { weight: number; score: number }
      total: number
      average: number
    }
    respectCommitment: {
      respectSuperiors: { weight: number; score: number }
      commitmentWork: { weight: number; score: number }
      total: number
      average: number
    }
    teamWork: {
      functionInTeam: { weight: number; score: number }
      workInTeam: { weight: number; score: number }
      total: number
      average: number
    }
    nonCoreCompetenciesAverage: number
  }

  // Overall Assessment
  overallAssessment: {
    performanceScore: number
    coreCompetenciesScore: number
    nonCoreCompetenciesScore: number
    overallTotal: number
    overallPercentage: number
    overallRating: 1 | 2 | 3 | 4 | 5
    ratingDescription: string
  }

  // Section 6: Appraiser Comments
  appraiserComments: string

  // Section 7: Career Development
  trainingDevelopmentPlan: string

  // Section 8: Assessment Decision
  assessmentDecision: "outstanding" | "suitable" | "likely_ready" | "not_ready" | "unlikely"

  // Section 9: Appraisee Comments
  appraiseeComments: string

  // Section 10: HOD Comments
  hodComments: string
  hodName: string
  hodSignature: string
  hodDate: string

  // Signatures and dates
  appraiserSignature: string
  appraiserSignatureDate: string
  appraiseeSignature: string
  appraiseeSignatureDate: string

  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, role: string) => Promise<boolean>
  logout: () => void
  impersonate: (userId: string) => void
}

export interface AccessRequest {
  id: string
  name: string
  email: string
  staffId?: string
  role: string
  division: string
  notes?: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
}

export interface AppState {
  users: User[]
  appraisals: Appraisal[]
  roles: string[]
  orgHierarchy: Record<string, string[]>
  accessRequests: AccessRequest[]
  getReports: (managerId: string) => User[]
  filteredUsers: (query: string) => User[]
  addUser: (user: Omit<User, "id" | "createdAt" | "updatedAt">) => void
  updateUser: (id: string, updates: Partial<User>) => void
  deleteUser: (id: string) => void
  addAppraisal: (appraisal: Omit<Appraisal, "id" | "createdAt" | "updatedAt">) => void
  updateAppraisal: (id: string, updates: Partial<Appraisal>) => void
  addAccessRequest: (request: Omit<AccessRequest, "id" | "submittedAt" | "status">) => void
  updateAccessRequest: (id: string, updates: Partial<AccessRequest>) => void
  approveAccessRequest: (id: string, managerId?: string) => void
  rejectAccessRequest: (id: string) => void
  exportData: () => string
  importData: (data: string) => void
}

export const ROLES = [
  "Director-General",
  "Deputy Director – General, Management Services",
  "Deputy Director – General, Operations",
  "Corporate Affairs Head",
  "Internal Audit Head",
  "Legal Services Head",
  "HR Management & Development Division Head",
  "Finance Division Head",
  "Administration Division Head",
  "Research, Innovation, Monitoring & Evaluation Division Head",
  "EduTech Division Head",
  "Infrastructure Planning & Development Division Head",
  "Apprenticeship Division Head",
  "Partnerships, WEL & Inclusion Division Head",
  "Training, Assessment & Quality Assurance Division Head",
  "Regional Director",
  "Unit Head",
  "Staff Member",
] as const

export type Role = (typeof ROLES)[number]
