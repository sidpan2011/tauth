
import { ThemeProvider } from './components/theme-provider'

import { Suspense, lazy } from 'react'
import { Homepage } from './components/Homepage'
import Docs from './components/Docs'
import Pricing from './components/Pricing'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

// const Homepage = lazy(() => import("./components/Homepage"))
// const Docs = lazy(() => import("./components/Docs"))

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey="vite-ui-theme">
      <Suspense fallback={<div>Loading...</div>}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Homepage />} />
            <Route path='/docs' element={<Docs />} />
            <Route path='/pricing' element={<Pricing />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </ThemeProvider>
  )
}

export default App
