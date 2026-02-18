import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export interface Task {
    id: string
    title: string
    completed: boolean
    type: 'non-negotiable' | 'optional'
    date?: Date
    time?: string
    isRecurring?: boolean
}

export interface UserSettings {
    rememberPhrases: string[]
    selectedDays: string[]
    meditationMinutes: number
    readingPages: number
}

export function useRotina(selectedDate: Date) {
    const { user } = useAuth()
    const [tasks, setTasks] = useState<Task[]>([])
    const [userSettings, setUserSettings] = useState<UserSettings | null>(null)
    const [loading, setLoading] = useState(true)

    // One-time setup: create recurring habits if they don't exist
    useEffect(() => {
        if (user) ensureDailyTasks()
    }, [user])

    // Fetch tasks whenever selected date changes
    useEffect(() => {
        if (user) fetchData()
    }, [user, selectedDate])

    const fetchData = async () => {
        setLoading(true)
        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user!.id)
                .single()

            if (profile) {
                setUserSettings({
                    rememberPhrases: profile.remember_me_phrases || [],
                    selectedDays: profile.selected_training_days || [],
                    meditationMinutes: profile.meditation_goal_minutes || 0,
                    readingPages: profile.reading_goal_pages || 0
                })
            }

            const selectedDateStr = selectedDate.toISOString().split('T')[0]
            const { data: fetchedTasks } = await supabase
                .from('tasks')
                .select('*')
                .eq('user_id', user!.id)
                .order('created_at', { ascending: true })

            if (fetchedTasks) {
                const relevantTasks = fetchedTasks
                    .filter(t => {
                        if (t.title === 'Treino do Dia' || t.title === 'Dia de Descanso (Rest Day)') return false
                        if (t.recurrence_pattern === 'daily') return true
                        if (t.due_date === selectedDateStr) return true
                        return false
                    })
                    .map(t => ({
                        id: t.id,
                        title: t.title,
                        completed: t.status === 'completed',
                        type: t.type as Task['type'],
                        date: t.due_date ? new Date(t.due_date) : undefined,
                        time: t.due_time ? t.due_time.substring(0, 5) : undefined,
                        isRecurring: t.recurrence_pattern === 'daily'
                    }))
                setTasks(relevantTasks)
            }
        } catch (error) {
            console.error('Error fetching rotina data:', error)
        } finally {
            setLoading(false)
        }
    }

    const ensureDailyTasks = async () => {
        const { data: profile } = await supabase
            .from('profiles')
            .select('meditation_goal_minutes, reading_goal_pages')
            .eq('id', user!.id)
            .single()

        if (!profile) return

        const { data: existingHabits } = await supabase
            .from('tasks')
            .select('id, title')
            .eq('user_id', user!.id)
            .eq('recurrence_pattern', 'daily')

        const hasMeditation = existingHabits?.some(t => t.title?.includes('Meditar'))
        const hasReading = existingHabits?.some(t => t.title?.includes('Ler'))

        if (!hasMeditation && profile.meditation_goal_minutes > 0) {
            await supabase.from('tasks').insert({
                user_id: user!.id,
                title: `Meditar ${profile.meditation_goal_minutes} min`,
                type: 'non-negotiable',
                recurrence_pattern: 'daily'
            })
        }
        if (!hasReading && profile.reading_goal_pages > 0) {
            await supabase.from('tasks').insert({
                user_id: user!.id,
                title: `Ler ${profile.reading_goal_pages} páginas`,
                type: 'non-negotiable',
                recurrence_pattern: 'daily'
            })
        }
    }

    const addTask = async (
        title: string,
        type: Task['type'],
        time: string,
        isRecurring: boolean,
        date: Date
    ): Promise<boolean> => {
        if (!title.trim()) return false

        const { data, error } = await supabase
            .from('tasks')
            .insert({
                user_id: user!.id,
                title,
                type,
                status: 'pending',
                due_date: date.toISOString().split('T')[0],
                due_time: time || null,
                recurrence_pattern: isRecurring ? 'daily' : null
            })
            .select()
            .single()

        if (error || !data) return false

        setTasks(prev => [...prev, {
            id: data.id,
            title: data.title,
            completed: false,
            type: data.type,
            date: data.due_date ? new Date(data.due_date) : undefined,
            time: data.due_time?.substring(0, 5),
            isRecurring: !!data.recurrence_pattern
        }])

        return true
    }

    const toggleTask = async (id: string, currentCompleted: boolean) => {
        // Optimistic update
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !currentCompleted } : t))

        const newStatus = currentCompleted ? 'pending' : 'completed'
        await supabase.from('tasks').update({ status: newStatus }).eq('id', id)

        // Optional tasks disappear when completed
        const task = tasks.find(t => t.id === id)
        if (task?.type === 'optional' && !currentCompleted) {
            setTimeout(() => {
                setTasks(prev => prev.filter(t => t.id !== id))
            }, 800)
        }
    }

    const deleteTask = async (id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id))
        await supabase.from('tasks').delete().eq('id', id)
    }

    const nonNegotiableTasks = tasks.filter(t => t.type === 'non-negotiable')
    const optionalTasks = tasks.filter(t => t.type === 'optional' && !t.completed)

    return {
        tasks,
        nonNegotiableTasks,
        optionalTasks,
        userSettings,
        loading,
        addTask,
        toggleTask,
        deleteTask,
        refetch: fetchData
    }
}
