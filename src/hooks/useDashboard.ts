import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export interface DashboardTask {
    id: string
    title: string
    duration?: string
    completed: boolean
    pillar: 'body' | 'mind' | 'spirit' | 'business'
}

export interface DashboardStats {
    streak: number
    totalStreak: number // Best streak
    level: number
    xp: number
}

export function useDashboard() {
    const { user } = useAuth()
    const [tasks, setTasks] = useState<DashboardTask[]>([])
    const [stats, setStats] = useState<DashboardStats>({
        streak: 0,
        totalStreak: 0,
        level: 1,
        xp: 0
    })
    const [userName, setUserName] = useState('')
    const [loading, setLoading] = useState(true)
    const [currentDate, setCurrentDate] = useState(new Date())

    useEffect(() => {
        if (user) {
            fetchDashboardData()
        }

        // Update date every minute just in case
        const timer = setInterval(() => setCurrentDate(new Date()), 60000)
        return () => clearInterval(timer)
    }, [user])

    const fetchDashboardData = async () => {
        setLoading(true)
        try {
            // 1. Fetch Profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('name') // We will need to add streak columns later
                .eq('id', user!.id)
                .single()

            if (profile) setUserName(profile.name)

            // 2. Fetch Tasks AND Recurring Habits for today
            const today = new Date().toISOString().split('T')[0]

            const { data: allTasks } = await supabase
                .from('tasks')
                .select('*')
                .eq('user_id', user!.id)

            if (allTasks) {
                const todaysTasks = allTasks.filter(t => {
                    if (t.recurrence_pattern === 'daily') return true
                    if (t.due_date === today) return true
                    return false
                }).map(t => ({
                    id: t.id,
                    title: t.title,
                    completed: t.status === 'completed',
                    duration: t.due_time || undefined,
                    pillar: inferPillar(t.title)
                }))

                setTasks(todaysTasks)
            }

            // 3. Calculate Streak (Simplified for now - assumes logic exists or defaults)
            // TODO: Implement real streak calculation based on logs
            setStats({
                streak: 3, // Mock value until Phase 10
                totalStreak: 12, // Mock value
                level: 5,
                xp: 450
            })

        } catch (error) {
            console.error('Error loading dashboard:', error)
        } finally {
            setLoading(false)
        }
    }

    const toggleTask = async (id: string, currentStatus: boolean) => {
        // Optimistic update
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !currentStatus } : t))

        const newStatus = currentStatus ? 'pending' : 'completed'
        await supabase.from('tasks').update({ status: newStatus }).eq('id', id)
    }

    const inferPillar = (title: string): DashboardTask['pillar'] => {
        const lower = title.toLowerCase()
        if (lower.includes('treino') || lower.includes('correr') || lower.includes('workout')) return 'body'
        if (lower.includes('ler') || lower.includes('estudar') || lower.includes('curso')) return 'mind'
        if (lower.includes('meditar') || lower.includes('meditação')) return 'spirit'
        return 'business' // Default or other
    }

    return {
        tasks,
        stats,
        userName,
        currentDate,
        loading,
        toggleTask,
        refetch: fetchDashboardData
    }
}
