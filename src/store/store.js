import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

const SESSION_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Function to check if session is expired
const isSessionExpired = (timestamp) => {
    if (!timestamp) return true;
    const now = new Date().getTime();
    return now - timestamp > SESSION_DURATION;
};

// Create atom with storage and session management
export const authAtom = atomWithStorage('auth', {
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
});

// Hydrated atom with session management and proper type checking
export const hydratedAuthAtom = atom(
    (get) => {
        const authState = get(authAtom);
        
        // Check for session expiration
        if (authState.isAuthenticated && isSessionExpired(authState.sessionStart)) {
            // Session expired - clear the state
            return {
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
            };
        }
        
        return authState;
    },
    (get, set, newValue) => {
        // Ensure the user data structure is correct
        const sanitizedValue = {
            ...newValue,
            user: {
                data: {
                    email: newValue.user?.data?.email || null,
                    is_keystroke_done: newValue.user?.data?.is_keystroke_done || false,
                    id: newValue.user?.data?.id || null,
                    created_at: newValue.user?.data?.created_at || null
                }
            },
            sessionStart: newValue.isAuthenticated ? new Date().getTime() : null
        };
        
        set(authAtom, sanitizedValue);
    }
);

// Session check atom with proper data structure
export const sessionCheckAtom = atom(null, (get, set) => {
    const authState = get(authAtom);
    
    if (authState.isAuthenticated && isSessionExpired(authState.sessionStart)) {
        set(authAtom, {
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
        });
        return false;
    }
    return true;
});