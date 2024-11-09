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
    user: null,
    sessionStart: null
});

// Hydrated atom with session management
export const hydratedAuthAtom = atom(
    (get) => {
        const authState = get(authAtom);
        
        // Check for session expiration
        if (authState.isAuthenticated && isSessionExpired(authState.sessionStart)) {
            // Session expired - clear the state
            return {
                isAuthenticated: false,
                user: null,
                sessionStart: null
            };
        }
        
        return authState;
    },
    (get, set, newValue) => {
        set(authAtom, {
            ...newValue,
            sessionStart: newValue.isAuthenticated ? new Date().getTime() : null
        });
    }
);

// Session check atom
export const sessionCheckAtom = atom(null, (get, set) => {
    const authState = get(authAtom);
    
    if (authState.isAuthenticated && isSessionExpired(authState.sessionStart)) {
        set(authAtom, {
            isAuthenticated: false,
            user: null,
            sessionStart: null
        });
        return false;
    }
    return true;
});