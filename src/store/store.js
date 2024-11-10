import { atom } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'

const SESSION_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

// Initial auth state structure
const initialAuthState = {
    isAuthenticated: false,
    user: {
        data: {
            email: null,
            is_keystroke_done: false,
            id: null,
            created_at: null
        }
    },
    sessionStart: null
}

// Create storage configuration with error handling
const storage = createJSONStorage(() => {
    try {
        return localStorage
    } catch (error) {
        console.error('localStorage access failed:', error)
        // Fallback to in-memory storage
        return {
            getItem: (key) => {
                try {
                    return JSON.stringify(initialAuthState)
                } catch (error) {
                    console.error('getItem failed:', error)
                    return null
                }
            },
            setItem: (key, value) => {
                try {
                    console.log('Setting item in fallback storage:', key, value)
                } catch (error) {
                    console.error('setItem failed:', error)
                }
            },
            removeItem: (key) => {
                try {
                    console.log('Removing item from fallback storage:', key)
                } catch (error) {
                    console.error('removeItem failed:', error)
                }
            }
        }
    }
})

// Function to check if session is expired with error handling
const isSessionExpired = (timestamp) => {
    try {
        if (!timestamp) return true
        const now = new Date().getTime()
        return now - timestamp > SESSION_DURATION
    } catch (error) {
        console.error('Session expiry check failed:', error)
        return true // Fail safe - consider session expired if check fails
    }
}

// Function to validate user data structure
const validateUserData = (userData) => {
    if (!userData || typeof userData !== 'object') return false
    if (!userData.data || typeof userData.data !== 'object') return false
    
    const requiredFields = ['email', 'is_keystroke_done', 'id', 'created_at']
    return requiredFields.every(field => field in userData.data)
}

// Function to sanitize auth state
const sanitizeAuthState = (state) => {
    try {
        return {
            isAuthenticated: Boolean(state.isAuthenticated),
            user: {
                data: {
                    email: state.user?.data?.email || null,
                    is_keystroke_done: Boolean(state.user?.data?.is_keystroke_done),
                    id: state.user?.data?.id || null,
                    created_at: state.user?.data?.created_at || null
                }
            },
            sessionStart: state.isAuthenticated ? Number(state.sessionStart) || new Date().getTime() : null
        }
    } catch (error) {
        console.error('Auth state sanitization failed:', error)
        return { ...initialAuthState }
    }
}

// Create atom with storage and session management
export const authAtom = atomWithStorage('auth', initialAuthState, storage, {
    subscribe: (callback) => {
        const handleStorage = (e) => {
            if (e.key === 'auth') {
                try {
                    const newValue = e.newValue ? JSON.parse(e.newValue) : initialAuthState
                    callback(sanitizeAuthState(newValue))
                } catch (error) {
                    console.error('Storage event handling failed:', error)
                    callback(initialAuthState)
                }
            }
        }

        window.addEventListener('storage', handleStorage)
        return () => {
            window.removeEventListener('storage', handleStorage)
        }
    }
})

// Rest of the code remains the same...
export const hydratedAuthAtom = atom(
    (get) => {
        try {
            const authState = get(authAtom)
            
            // Validate auth state structure
            if (!validateUserData(authState.user)) {
                return initialAuthState
            }
            
            // Check for session expiration
            if (authState.isAuthenticated && isSessionExpired(authState.sessionStart)) {
                return initialAuthState
            }
            
            return authState
        } catch (error) {
            console.error('Hydrated auth state retrieval failed:', error)
            return initialAuthState
        }
    },
    (get, set, newValue) => {
        try {
            // Sanitize and validate new value
            const sanitizedValue = sanitizeAuthState(newValue)
            
            if (!validateUserData(sanitizedValue.user)) {
                console.error('Invalid user data structure')
                return
            }
            
            set(authAtom, sanitizedValue)
        } catch (error) {
            console.error('Auth state update failed:', error)
            set(authAtom, initialAuthState)
        }
    }
)

export const sessionCheckAtom = atom(
    null,
    (get, set) => {
        try {
            const authState = get(authAtom)
            
            if (!validateUserData(authState.user)) {
                set(authAtom, initialAuthState)
                return false
            }
            
            if (authState.isAuthenticated && isSessionExpired(authState.sessionStart)) {
                set(authAtom, initialAuthState)
                return false
            }
            
            return true
        } catch (error) {
            console.error('Session check failed:', error)
            set(authAtom, initialAuthState)
            return false
        }
    }
)

export { initialAuthState }