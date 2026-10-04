import type { AuditEvent } from '../data/types.ts'
import { sha256 } from './hash.ts'

export const GENESIS = 'AGRISURE-GENESIS-0000000000000000'

type PayloadSource = Omit<AuditEvent, 'payload' | 'prevHash' | 'hash'>

export function eventPayload(event: PayloadSource) {
  return [
    event.id,
    event.timestamp,
    event.code,
    event.product,
    event.location,
    event.province,
    event.result,
    event.network,
    event.channel,
    event.device,
    event.action,
    event.kind,
  ].join('|')
}

export function sealEvent(event: PayloadSource, prevHash: string): AuditEvent {
  const payload = eventPayload(event)
  const hash = sha256(`${prevHash}|${payload}`)
  return { ...event, payload, prevHash, hash }
}

export function makeId(prefix: string) {
  const noise = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0')
  return `${prefix}-${Date.now().toString(36)}-${noise}`.toUpperCase()
}
