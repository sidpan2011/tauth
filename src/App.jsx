
import { ThemeProvider } from './components/theme-provider'
import { Suspense, lazy, useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
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

const ProtectedRoute = ({ children }) => {
  const [auth] = useAtom(hydratedAuthAtom)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Small delay to ensure auth state is loaded
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <Spinner />
  }

  if (!auth?.isAuthenticated) {
    return <Navigate to="/getting-started/auth" replace />
  }

  return children
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
            <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
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
