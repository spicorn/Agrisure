import type { AppState, AuditEvent, FarmerReport, Language, ProductCode, ReportStatus } from '../data/types.ts'
import { eventPayload } from '../lib/ledger.ts'
import { createInitialState } from './logic.ts'

export type Action =
  | { type: 'COMMIT_VERIFY'; event: AuditEvent; patch?: { code: string; status: 'already_used'; verifiedAt: string; verifiedLocation: string } }
  | { type: 'ADD_CODES'; codes: ProductCode[]; event: AuditEvent }
  | { type: 'ADD_REPORT'; report: FarmerReport; event: AuditEvent }
  | { type: 'APPEND'; event: AuditEvent }
  | { type: 'REPORT_STATUS'; id: string; status: ReportStatus }
  | { type: 'LANGUAGE'; language: Language }
  | { type: 'RESET' }
  | { type: 'TAMPER' }
  | { type: 'RESTORE' }

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'COMMIT_VERIFY':
      return {
        ...state,
        events: [...state.events, action.event],
        codes: action.patch
          ? state.codes.map((item) => (item.code === action.patch?.code ? { ...item, ...action.patch } : item))
          : state.codes,
      }
    case 'ADD_CODES':
      return { ...state, codes: [...state.codes, ...action.codes], events: [...state.events, action.event] }
    case 'ADD_REPORT':
      return { ...state, reports: [action.report, ...state.reports], events: [...state.events, action.event] }
    case 'APPEND':
      return { ...state, events: [...state.events, action.event] }
    case 'REPORT_STATUS':
      return {
        ...state,
        reports: state.reports.map((report) => (report.id === action.id ? { ...report, status: action.status } : report)),
      }
    case 'LANGUAGE':
      return { ...state, language: action.language }
    case 'RESET':
      return { ...createInitialState(), language: state.language }
    case 'TAMPER': {
      if (state.tamper || state.events.length < 6) return state
      const index = Math.min(8, state.events.length - 3)
      const target = state.events[index]
      const forgedLocation = `${target.location} (edited)`
      return {
        ...state,
        tamper: {
          id: target.id,
          forgedLocation,
          forgedPayload: eventPayload({ ...target, location: forgedLocation }),
        },
      }
    }
    case 'RESTORE':
      return { ...state, tamper: null }
    default:
      return state
  }
}
