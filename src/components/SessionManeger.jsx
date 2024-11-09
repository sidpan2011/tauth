import { useEffect, useCallback } from 'react'
import { useAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'
import { hydratedAuthAtom, sessionCheckAtom } from '../store/store'
import { toast } from '../hooks/use-toast'
import { AlertCircle } from 'lucide-react'

const SESSION_CHECK_INTERVAL = 1000 * 60; // Check every minute

const SessionManager = () => {
    const [auth, setAuth] = useAtom(hydratedAuthAtom);
    const [, checkSession] = useAtom(sessionCheckAtom);
    const navigate = useNavigate();

    const handleSessionExpiry = useCallback(() => {
        setAuth({
            isAuthenticated: false,
            user: null
        });
        
        toast({
            icon: <AlertCircle className="h-5 w-5 text-red-500" />,
            title: "Session Expired",
            description: "Your session has expired. Please sign in again.",
            variant: "destructive"
        });
        
        navigate('/getting-started/auth');
    }, [setAuth, navigate]);

    // Regular session check
    useEffect(() => {
        if (!auth.isAuthenticated) return;

        const intervalId = setInterval(() => {
            const isValid = checkSession();
            if (!isValid) {
                handleSessionExpiry();
            }
        }, SESSION_CHECK_INTERVAL);

        return () => clearInterval(intervalId);
    }, [auth.isAuthenticated, checkSession, handleSessionExpiry]);

    // Check session on window focus
    useEffect(() => {
        if (!auth.isAuthenticated) return;

        const handleFocus = () => {
            const isValid = checkSession();
            if (!isValid) {
                handleSessionExpiry();
            }
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [auth.isAuthenticated, checkSession, handleSessionExpiry]);

    return null;
};

export default SessionManager;