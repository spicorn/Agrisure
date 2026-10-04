import { createContext } from 'react'
import type { AppState, Language, ProductCode, ReportStatus, VerifyOutcome } from '../data/types.ts'
import type { GenerateInput, ReportInput, VerifyInput } from './logic.ts'

export interface Store extends AppState {
  verifyCode: (input: VerifyInput) => VerifyOutcome
  generateCodes: (input: GenerateInput) => ProductCode[]
  submitReport: (input: ReportInput) => void
  setReportStatus: (id: string, status: ReportStatus) => void
  setLanguage: (language: Language) => void
  resetDemo: () => void
  tamperTest: () => void
  restoreChain: () => void
}

export const verificationContext = createContext<Store | null>(null)
