import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface User {
    id: string
    name: string
    handle: string
}

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    login: (handle: string, pin: string) => Promise<{ success: boolean; error?: string }>
    signup: (name: string, handle: string, pin: string) => Promise<{ success: boolean; error?: string }>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        // Check active Supabase session on mount
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (session?.user) {
                await loadUserProfile(session.user.id)
            }
        })

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                await loadUserProfile(session.user.id)
            } else {
                setUser(null)
                setIsAuthenticated(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const loadUserProfile = async (userId: string) => {
        const { data: profile } = await supabase
            .from('profiles')
            .select('id, name, handle')
            .eq('id', userId)
            .single()

        if (profile) {
            setUser({
                id: profile.id,
                name: profile.name || 'User',
                handle: profile.handle || ''
            })
            setIsAuthenticated(true)
        }
    }

    // handle → used as the "email" internally: @pedro → pedro@app.local
    const handleToEmail = (handle: string) => {
        const clean = handle.replace(/^@/, '').toLowerCase().trim()
        return `${clean}@app.local`
    }

    const login = async (handle: string, pin: string) => {
        const email = handleToEmail(handle)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password: pin
        })

        if (error) {
            console.error('Login failed:', error.message)
            return { success: false, error: '@ ou PIN incorretos.' }
        }

        navigate('/')
        return { success: true }
    }

    const signup = async (name: string, handle: string, pin: string) => {
        // Normalize handle — strip @ if user typed it
        const cleanHandle = handle.replace(/^@/, '').toLowerCase().trim()

        // Check if handle is already taken
        const { data: existing } = await supabase
            .from('profiles')
            .select('id')
            .eq('handle', cleanHandle)
            .maybeSingle()

        if (existing) {
            return { success: false, error: `O @${cleanHandle} já está a ser usado. Escolhe outro.` }
        }

        const email = handleToEmail(cleanHandle)

        const { data, error } = await supabase.auth.signUp({
            email,
            password: pin,
            options: {
                data: { name, handle: cleanHandle }
            }
        })

        if (error) {
            console.error('Signup failed:', error.message)
            return { success: false, error: 'Erro ao criar conta. Tenta novamente.' }
        }

        // Save handle to profiles table
        if (data.user) {
            await supabase
                .from('profiles')
                .update({ handle: cleanHandle, name })
                .eq('id', data.user.id)
        }

        navigate('/onboarding')
        return { success: true }
    }

    const logout = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setIsAuthenticated(false)
        navigate('/login')
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
