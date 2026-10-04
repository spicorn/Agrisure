import { useEffect, useLayoutEffect, useReducer, useRef, type ReactNode } from 'react'
import type { AppState } from '../data/types.ts'
import { createInitialState, planGeneration, planReport, planSimulated, planVerification } from './logic.ts'
import { reducer } from './reducer.ts'
import { verificationContext, type Store } from './store.ts'

const STORAGE_KEY = 'agrisure-v1'

function init(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createInitialState()
    const parsed = JSON.parse(raw) as AppState
    if (parsed.version === 1 && Array.isArray(parsed.codes) && Array.isArray(parsed.events) && parsed.events.length > 0) {
      return parsed
    }
  } catch {
    /* fall through to a fresh seed */
  }
  return createInitialState()
}

export function VerificationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, init)
  const stateRef = useRef(state)

  useLayoutEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage may be full or blocked; the in-memory demo still works */
    }
  }, [state])

  useEffect(() => {
    let timer = 0
    let stopped = false
    const loop = () => {
      const wait = 6000 + Math.random() * 2000
      timer = window.setTimeout(() => {
        if (stopped) return
        if (!document.hidden) dispatch({ type: 'APPEND', event: planSimulated(stateRef.current) })
        loop()
      }, wait)
    }
    loop()
    return () => {
      stopped = true
      window.clearTimeout(timer)
    }
  }, [])

  const api: Store = {
    ...state,
    verifyCode: (input) => {
      const planned = planVerification(stateRef.current, input)
      dispatch({ type: 'COMMIT_VERIFY', event: planned.event, patch: planned.patch })
      return planned.outcome
    },
    generateCodes: (input) => {
      const planned = planGeneration(stateRef.current, input)
      dispatch({ type: 'ADD_CODES', codes: planned.codes, event: planned.event })
      return planned.codes
    },
    submitReport: (input) => {
      const planned = planReport(stateRef.current, input)
      dispatch({ type: 'ADD_REPORT', report: planned.report, event: planned.event })
    },
    setReportStatus: (id, status) => dispatch({ type: 'REPORT_STATUS', id, status }),
    setLanguage: (language) => dispatch({ type: 'LANGUAGE', language }),
    resetDemo: () => dispatch({ type: 'RESET' }),
    tamperTest: () => dispatch({ type: 'TAMPER' }),
    restoreChain: () => dispatch({ type: 'RESTORE' }),
  }

  return <verificationContext.Provider value={api}>{children}</verificationContext.Provider>
}
