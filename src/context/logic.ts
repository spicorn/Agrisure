import { buildHistory } from '../data/mockEvents.ts'
import { createSeedCodes, SEED_CODE_LIST, SUGGESTED_PRODUCTS, type ManufacturerName } from '../data/mockCodes.ts'
import { PLACES, provinceOf } from '../data/provinces.ts'
import type { AppState, AuditEvent, Channel, FarmerReport, Network, ProductCode, VerifyOutcome } from '../data/types.ts'
import { GENESIS, makeId, sealEvent } from '../lib/ledger.ts'

export const QR_WINDOW_MS = 30 * 60 * 1000

const SIM_PRODUCTS = [
  'SeedCo SC 727 Late Maturity Maize Seed 25kg',
  'Windmill Compound D Fertilizer 50kg',
  'ZFC Broiler Starter Stockfeed 50kg',
  'FarmSafe 30EC Lambda-Cyhalothrin 500mL',
  'Agricura Glyphosate 360 SL 1L',
  'Profeeds Layers Mash 50kg',
]

const NETWORKS: Network[] = ['Econet', 'NetOne', 'Telecel', 'TelOne']

export function createInitialState(): AppState {
  const issuedAt = Date.now()
  return {
    version: 1,
    codes: createSeedCodes(issuedAt),
    events: buildHistory(issuedAt),
    reports: [],
    language: 'en',
    tamper: null,
  }
}

export function normalizeCode(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, '')
}

export function isQrExpired(issuedAt: number, now = Date.now()) {
  return now - issuedAt >= QR_WINDOW_MS
}

function lastHash(state: AppState) {
  return state.events[state.events.length - 1]?.hash ?? GENESIS
}

export interface VerifyInput {
  code: string
  channel: Channel
  network: Network
  place: string
}

export interface PlannedVerification {
  outcome: VerifyOutcome
  event: AuditEvent
  patch?: { code: string; status: 'already_used'; verifiedAt: string; verifiedLocation: string }
}

const emptyOutcome = (code: string): VerifyOutcome => ({
  result: 'counterfeit',
  code,
  product: 'Unknown product',
  shortName: 'Unknown product',
  manufacturer: '—',
  batch: '—',
  manufactureDate: '—',
  expiry: '—',
  retailer: '—',
})

export function planVerification(state: AppState, input: VerifyInput): PlannedVerification {
  const code = normalizeCode(input.code)
  const nowIso = new Date().toISOString()
  const found = state.codes.find((item) => item.code === code || item.pin === code)
  const province = provinceOf(input.place)
  const base = {
    id: makeId('EVT'),
    timestamp: nowIso,
    code: found?.code ?? (code || 'BLANK'),
    location: input.place,
    province,
    network: input.network,
    channel: input.channel,
    device: input.channel === 'qr' ? 'Smartphone' : 'Feature phone',
    kind: 'verification' as const,
  }

  if (!found) {
    const event = sealEvent(
      { ...base, product: 'Unknown product', result: 'counterfeit', action: 'Code not found' },
      lastHash(state),
    )
    return { outcome: emptyOutcome(code || 'BLANK'), event }
  }

  if (found.status === 'already_used') {
    const event = sealEvent(
      { ...base, product: found.product, result: 'already_used', action: 'Repeat scan blocked' },
      lastHash(state),
    )
    return {
      outcome: {
        result: 'already_used',
        code: found.code,
        product: found.product,
        shortName: found.shortName,
        manufacturer: found.manufacturer,
        batch: found.batch,
        manufactureDate: found.manufactureDate,
        expiry: found.expiry,
        retailer: found.retailer,
        verifiedAt: found.verifiedAt,
        verifiedLocation: found.verifiedLocation,
      },
      event,
    }
  }

  if (isQrExpired(found.issuedAt)) {
    const event = sealEvent(
      { ...base, product: found.product, result: 'expired', action: 'QR window expired' },
      lastHash(state),
    )
    return {
      outcome: {
        result: 'expired',
        code: found.code,
        product: found.product,
        shortName: found.shortName,
        manufacturer: found.manufacturer,
        batch: found.batch,
        manufactureDate: found.manufactureDate,
        expiry: found.expiry,
        retailer: found.retailer,
      },
      event,
    }
  }

  const event = sealEvent(
    { ...base, product: found.product, result: 'genuine', action: 'First verification' },
    lastHash(state),
  )
  return {
    outcome: {
      result: 'genuine',
      code: found.code,
      product: found.product,
      shortName: found.shortName,
      manufacturer: found.manufacturer,
      batch: found.batch,
      manufactureDate: found.manufactureDate,
      expiry: found.expiry,
      retailer: found.retailer,
      verifiedAt: nowIso,
      verifiedLocation: input.place,
    },
    event,
    patch: { code: found.code, status: 'already_used', verifiedAt: nowIso, verifiedLocation: input.place },
  }
}

export interface GenerateInput {
  manufacturer: string
  product: string
  batch: string
  quantity: number
}

function randomCode(taken: Set<string>) {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const next = () => {
    const digits = String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0')
    const letter = letters[Math.floor(Math.random() * letters.length)] ?? 'A'
    return `AGR${digits}${letter}`
  }
  let code = next()
  while (taken.has(code)) code = next()
  taken.add(code)
  return code
}

function categoryFor(manufacturer: string): ProductCode['category'] {
  if (manufacturer in SUGGESTED_PRODUCTS) return SUGGESTED_PRODUCTS[manufacturer as ManufacturerName].category
  return 'seed'
}

export function planGeneration(state: AppState, input: GenerateInput) {
  const quantity = Math.min(50, Math.max(1, Math.floor(input.quantity) || 1))
  const taken = new Set(state.codes.map((item) => item.code))
  const issuedAt = Date.now()
  const made = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date())
  const expiryDate = new Date()
  expiryDate.setFullYear(expiryDate.getFullYear() + 2)
  const expiry = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(expiryDate)
  const product = input.product.trim() || 'Unnamed product'
  const codes: ProductCode[] = Array.from({ length: quantity }, () => {
    const code = randomCode(taken)
    const pin = String(Math.floor(100000 + Math.random() * 900000))
    return {
      code,
      pin,
      status: 'genuine' as const,
      product,
      shortName: product.split(' ').slice(0, 3).join(' '),
      manufacturer: input.manufacturer,
      batch: input.batch.trim() || 'UNBATCHED',
      manufactureDate: made,
      expiry,
      retailer: 'Awaiting dealer assignment',
      category: categoryFor(input.manufacturer),
      issuedAt,
    }
  })
  const event = sealEvent(
    {
      id: makeId('EVT'),
      timestamp: new Date().toISOString(),
      code: codes[0]?.code ?? 'BATCH',
      product,
      location: 'Harare',
      province: 'Harare',
      result: 'genuine',
      network: 'TelOne',
      channel: 'qr',
      device: 'Manufacturer portal',
      action: `Issued ${quantity} codes`,
      kind: 'issuance',
    },
    lastHash(state),
  )
  return { codes, event }
}

export interface ReportInput {
  code: string
  product: string
  dealerName: string
  place: string
  note: string
  hasPhoto: boolean
}

export function planReport(state: AppState, input: ReportInput) {
  const timestamp = new Date().toISOString()
  const report: FarmerReport = {
    id: makeId('RPT'),
    timestamp,
    code: normalizeCode(input.code),
    product: input.product,
    dealerName: input.dealerName.trim(),
    location: input.place.trim(),
    province: provinceOf(input.place),
    note: input.note.trim(),
    hasPhoto: input.hasPhoto,
    status: 'new',
  }
  const event = sealEvent(
    {
      id: makeId('EVT'),
      timestamp,
      code: report.code,
      product: report.product,
      location: report.location,
      province: report.province,
      result: 'counterfeit',
      network: 'Econet',
      channel: 'qr',
      device: 'Farmer report',
      action: 'Counterfeit report filed',
      kind: 'report',
    },
    lastHash(state),
  )
  return { report, event }
}

export function planSimulated(state: AppState): AuditEvent {
  const place = PLACES[Math.floor(Math.random() * PLACES.length)]
  const channel = Math.random() > 0.45 ? 'qr' : 'sms'
  const roll = Math.random()
  const result = roll < 0.18 ? 'counterfeit' : roll < 0.3 ? 'already_used' : 'genuine'
  const digits = String(Math.floor(Math.random() * 900000) + 100000)
  const letter = 'ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.floor(Math.random() * 22)]
  const product = result === 'counterfeit' ? 'Unknown product' : SIM_PRODUCTS[Math.floor(Math.random() * SIM_PRODUCTS.length)]
  return sealEvent(
    {
      id: makeId('EVT'),
      timestamp: new Date().toISOString(),
      code: `AGR${digits}${letter}`,
      product,
      location: place.name,
      province: place.province,
      result,
      network: NETWORKS[Math.floor(Math.random() * NETWORKS.length)],
      channel,
      device: channel === 'qr' ? 'Smartphone' : 'Feature phone',
      action: result === 'genuine' ? 'First verification' : result === 'already_used' ? 'Repeat scan blocked' : 'Code not found',
      kind: 'verification',
    },
    lastHash(state),
  )
}

export function isSeedCode(code: string) {
  return (SEED_CODE_LIST as readonly string[]).includes(code)
}
