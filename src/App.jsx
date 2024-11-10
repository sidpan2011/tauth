
import { ThemeProvider } from './components/theme-provider'

import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { Spinner } from './components/Spinner'
import { Toaster } from './components/ui/toaster'
import SessionManager from './components/SessionManeger'
import { hydratedAuthAtom } from './store/store.js'
import { useAtom } from 'jotai'

const Homepage = lazy(() => import("./components/Homepage"))
const Docs = lazy(() => import("./components/Docs"))
const Pricing = lazy(() => import("./components/Pricing"))
const Auth = lazy(() => import("./components/Auth"))
const Dashboard = lazy(() => import("./components/Dashboard"))

const ProtectedRoute = ({ element: Element }) => {
  const [auth] = useAtom(hydratedAuthAtom)
  
  if (!auth.isAuthenticated) {
    return <Navigate to="/getting-started/auth" replace />
  }

  return <Element />
}

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey="vite-ui-theme">
      <Suspense fallback={<Spinner />}>
        <BrowserRouter>
          <SessionManager />
          <Routes>
            <Route path='/' element={<Homepage />} />
            <Route path='/docs' element={<Docs />} />
            <Route path='/pricing' element={<Pricing />} />
            <Route path='/getting-started/auth' element={<Auth />} />
            <Route path='/dashboard' element={<ProtectedRoute element={<Dashboard />} />} />
            {/* <Route path='/dashboard' element={<Dashboard />} /> */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </Suspense>
    </ThemeProvider>
  )
}

export default App
