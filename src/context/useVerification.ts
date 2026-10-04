import { useContext } from 'react'
import { verificationContext } from './store.ts'

export function useVerification() {
  const ctx = useContext(verificationContext)
  if (!ctx) throw new Error('useVerification must be used within VerificationProvider')
  return ctx
}
