import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Nav } from './components/Nav'
import { Home } from './pages/Home'
import { Garage, VehicleDetail } from './pages/Garage'
import { Library, Bench } from './pages/Library'
import { Runner } from './pages/Runner'
import { Path } from './pages/Path'
import { Exam } from './pages/Exam'
import { DiagnosticBay, DiagnosticCase } from './pages/Diagnose'
import { Measure } from './pages/Measure'
import { Torque } from './pages/Torque'
import { Safety } from './pages/Safety'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function Footer() {
  const { pathname } = useLocation()
  if (pathname.startsWith('/procedure/')) return null
  if (/^\/diagnose\/.+/.test(pathname)) return null
  return (
    <footer className="mt-16 border-t border-shop-800 px-5 py-8">
      <div className="mx-auto max-w-[1500px] text-[11.5px] leading-relaxed text-shop-600">
        <p className="max-w-[80ch]">
          TorqueLab is a training environment. The 3D assemblies are teaching models built to show relationships,
          sequence and fastener function — they are not dimensionally accurate CAD, and they are not a substitute
          for factory service information. Vehicle names and engine codes are used to identify the platforms being
          taught. Always work to the manufacturer's published procedure and specifications on a real vehicle.
        </p>
        <p className="mt-3 font-mono tracking-wide">
          Built with React · Three.js · react-three-fiber — every assembly generated procedurally in code.
        </p>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    // BASE_URL is "/" in dev and "/torquelab/" in the GitHub Pages build, so
    // routes resolve correctly in both without a second source of truth.
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollTop />
      <div className="flex min-h-full flex-col">
        <Nav />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/path" element={<Path />} />
            <Route path="/path/:levelId/exam" element={<Exam />} />
            <Route path="/garage" element={<Garage />} />
            <Route path="/vehicle/:id" element={<VehicleDetail />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/measure" element={<Measure />} />
            <Route path="/torque" element={<Torque />} />
            <Route path="/diagnose" element={<DiagnosticBay />} />
            <Route path="/diagnose/:id" element={<DiagnosticCase />} />
            <Route path="/library" element={<Library />} />
            <Route path="/bench" element={<Bench />} />
            <Route path="/procedure/:id" element={<Runner />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
