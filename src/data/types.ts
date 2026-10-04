export type Language = 'en' | 'sn' | 'nd'

export type VerifyStatus = 'genuine' | 'already_used' | 'counterfeit' | 'expired'

export type Channel = 'qr' | 'sms'

export type Network = 'Econet' | 'NetOne' | 'Telecel' | 'TelOne'

export type ReportStatus = 'new' | 'investigating' | 'referred'

export type ProductCategory = 'seed' | 'fertilizer' | 'pesticide' | 'feed'

export type EventKind = 'verification' | 'report' | 'issuance'

export interface ProductCode {
  code: string
  pin: string
  status: 'genuine' | 'already_used'
  product: string
  shortName: string
  manufacturer: string
  batch: string
  manufactureDate: string
  expiry: string
  retailer: string
  category: ProductCategory
  issuedAt: number
  verifiedAt?: string
  verifiedLocation?: string
}

export interface AuditEvent {
  id: string
  timestamp: string
  code: string
  product: string
  location: string
  province: string
  result: VerifyStatus
  network: Network
  channel: Channel
  device: string
  action: string
  kind: EventKind
  payload: string
  prevHash: string
  hash: string
}

export interface FarmerReport {
  id: string
  timestamp: string
  code: string
  product: string
  dealerName: string
  location: string
  province: string
  note: string
  hasPhoto: boolean
  status: ReportStatus
}

export interface TamperMark {
  id: string
  forgedLocation: string
  forgedPayload: string
}

export interface AppState {
  version: 1
  codes: ProductCode[]
  events: AuditEvent[]
  reports: FarmerReport[]
  language: Language
  tamper: TamperMark | null
}

export interface VerifyOutcome {
  result: VerifyStatus
  code: string
  product: string
  shortName: string
  manufacturer: string
  batch: string
  manufactureDate: string
  expiry: string
  retailer: string
  verifiedAt?: string
  verifiedLocation?: string
}
