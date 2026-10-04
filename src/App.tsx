import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { VerificationProvider } from './context/VerificationContext.tsx'
import Audit from './pages/Audit.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Demo from './pages/Demo.tsx'
import Landing from './pages/Landing.tsx'
import Manufacturer from './pages/Manufacturer.tsx'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
        <Routes location={location}>
          <Route path="/" element={<Landing />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/manufacturer" element={<Manufacturer />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/audit" element={<Audit />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function routerBasename() {
  const base = import.meta.env.BASE_URL
  if (base === '/') return undefined
  return base.endsWith('/') ? base.slice(0, -1) : base
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <VerificationProvider>
        <BrowserRouter basename={routerBasename()}>
          <AnimatedRoutes />
        </BrowserRouter>
      </VerificationProvider>
    </MotionConfig>
  )
}
