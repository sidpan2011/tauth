import { useEffect, useCallback, useRef } from 'react'
import { useAtom } from 'jotai'
import { useNavigate, useLocation } from 'react-router-dom'
import { hydratedAuthAtom, sessionCheckAtom } from '../store/store.js'
import { toast } from '../hooks/use-toast.js'
import { AlertCircle } from 'lucide-react'

const SESSION_CHECK_INTERVAL = 1000 * 60 // Check every minute
const PUBLIC_ROUTES = ['/', '/docs', '/pricing', '/getting-started/auth']

const SessionManager = () => {
    const [auth, setAuth] = useAtom(hydratedAuthAtom)
    const [, checkSession] = useAtom(sessionCheckAtom)
    const navigate = useNavigate()
    const location = useLocation()
    const toastShownRef = useRef(false)
    
    // Reset toast flag when route changes
    useEffect(() => {
        toastShownRef.current = false
    }, [location.pathname])

    const handleSessionExpiry = useCallback(() => {
        // Prevent multiple toasts
        if (!toastShownRef.current) {
            setAuth({
                isAuthenticated: false,
                user: null,
                sessionStart: null // Clear session start time
            })
            
            // Only show toast if user is not on a public route
            if (!PUBLIC_ROUTES.includes(location.pathname)) {
                toast({
                    icon: <AlertCircle className="h-5 w-5 text-red-500" />,
                    title: "Session Expired",
                    description: "Your session has expired. Please sign in again.",
                    variant: "destructive"
                })
                toastShownRef.current = true
            }
            
            // Store the intended destination
            if (!PUBLIC_ROUTES.includes(location.pathname)) {
                sessionStorage.setItem('redirectAfterLogin', location.pathname)
            }
            
            navigate('/getting-started/auth', { replace: true })
        }
    }, [setAuth, navigate, location.pathname])

    // Regular session check with error handling
    useEffect(() => {
        if (!auth.isAuthenticated) return

        let intervalId
        try {
            intervalId = setInterval(() => {
                try {
                    const isValid = checkSession()
                    if (!isValid) {
                        handleSessionExpiry()
                    }
                } catch (error) {
                    console.error('Session check failed:', error)
                    handleSessionExpiry()
                }
            }, SESSION_CHECK_INTERVAL)
        } catch (error) {
            console.error('Failed to setup session check:', error)
        }

        return () => {
            if (intervalId) clearInterval(intervalId)
        }
    }, [auth.isAuthenticated, checkSession, handleSessionExpiry])

    // Check session on window focus with error handling
    useEffect(() => {
        if (!auth.isAuthenticated) return

        const handleFocus = async () => {
            try {
                const isValid = checkSession()
                if (!isValid) {
                    handleSessionExpiry()
                }
            } catch (error) {
                console.error('Focus session check failed:', error)
                handleSessionExpiry()
            }
        }

        window.addEventListener('focus', handleFocus)
        return () => window.removeEventListener('focus', handleFocus)
    }, [auth.isAuthenticated, checkSession, handleSessionExpiry])

    // Check session on page load/refresh
    useEffect(() => {
        if (auth.isAuthenticated) {
            try {
                const isValid = checkSession()
                if (!isValid) {
                    handleSessionExpiry()
                }
            } catch (error) {
                console.error('Initial session check failed:', error)
                handleSessionExpiry()
            }
        }
    }, []) // Empty dependency array for initial check only

    // Handle storage events (for multi-tab support)
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'authToken' && !e.newValue && auth.isAuthenticated) {
                handleSessionExpiry()
            }
        }

        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [auth.isAuthenticated, handleSessionExpiry])

    return null
}

export default SessionManager