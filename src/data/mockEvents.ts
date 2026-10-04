import type { AuditEvent, Network, VerifyStatus } from './types.ts'
import { PLACES } from './provinces.ts'
import { GENESIS, sealEvent } from '../lib/ledger.ts'

const PRODUCTS = [
  'SeedCo SC 727 Late Maturity Maize Seed 25kg',
  'FarmSafe 30EC Lambda-Cyhalothrin 500mL',
  'Windmill Compound D Fertilizer 50kg',
  'ZFC Broiler Starter Stockfeed 50kg',
  'Agricura Glyphosate 360 SL 1L',
  'SeedCo SC 513 Early Maize Seed 10kg',
  'Windmill Ammonium Nitrate 50kg',
  'Profeeds Layers Mash 50kg',
]

const NETWORKS: Network[] = ['Econet', 'NetOne', 'Telecel', 'TelOne']

function mulberry32(seed: number) {
  let value = seed
  return () => {
    value |= 0
    value = (value + 0x6d2b79f5) | 0
    let t = Math.imul(value ^ (value >>> 15), 1 | value)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function fakeBias(place: string) {
  if (place === 'Murehwa') return 0.4
  if (place === 'Harare') return 0.3
  if (place === 'Mutare') return 0.24
  return 0.15
}

export function buildHistory(now = Date.now()): AuditEvent[] {
  const rand = mulberry32(20261004)
  const start = now - 13 * 24 * 60 * 60 * 1000
  const drafts: Omit<AuditEvent, 'payload' | 'prevHash' | 'hash'>[] = []

  for (let i = 0; i < 59; i += 1) {
    const when = start + ((i + rand() * 0.9) / 59) * (now - start - 2 * 60 * 60 * 1000)
    const place = PLACES[Math.floor(rand() * PLACES.length)]
    const product = PRODUCTS[Math.floor(rand() * PRODUCTS.length)]
    const channel = rand() > 0.42 ? 'qr' : 'sms'
    const network = NETWORKS[Math.floor(rand() * NETWORKS.length)]
    const roll = rand()
    const bias = fakeBias(place.name)
    const result: VerifyStatus = roll < bias ? 'counterfeit' : roll < bias + 0.12 ? 'already_used' : 'genuine'
    const digits = String(100000 + Math.floor(rand() * 900000))
    const letter = 'ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.floor(rand() * 22)]
    drafts.push({
      id: `EVT-H${String(i + 1).padStart(3, '0')}`,
      timestamp: new Date(when).toISOString(),
      code: `AGR${digits}${letter}`,
      product: result === 'counterfeit' ? 'Unknown product' : product,
      location: place.name,
      province: place.province,
      result,
      network,
      channel,
      device: channel === 'qr' ? 'Smartphone' : 'Feature phone',
      action: result === 'genuine' ? 'First verification' : result === 'already_used' ? 'Repeat scan blocked' : 'Code not found',
      kind: 'verification',
    })
  }

  drafts.push({
    id: 'EVT-H060',
    timestamp: '2026-10-03T07:40:00.000Z',
    code: 'AGR263337W',
    product: 'SeedCo SC 513 Early Maize Seed 10kg',
    location: 'Murehwa',
    province: 'Mashonaland East',
    result: 'genuine',
    network: 'Econet',
    channel: 'sms',
    device: 'Feature phone',
    action: 'First verification',
    kind: 'verification',
  })

  drafts.sort((a, b) => a.timestamp.localeCompare(b.timestamp))

  let prev = GENESIS
  return drafts.map((draft) => {
    const sealed = sealEvent(draft, prev)
    prev = sealed.hash
    return sealed
  })
}
