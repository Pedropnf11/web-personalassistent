import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export interface MeditacaoSession {
    date: string
    duration_minutes: number
    goal_met: boolean
}

export function useMeditacao() {
    const { user } = useAuth()
    const [goalMinutes, setGoalMinutes] = useState(10)
    const [timeElapsed, setTimeElapsed] = useState(0)
    const [isActive, setIsActive] = useState(false)
    const [isFocusMode, setIsFocusMode] = useState(true)
    const [sessionComplete, setSessionComplete] = useState(false)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const goalSeconds = goalMinutes * 60
    const timeLeft = Math.max(0, goalSeconds - timeElapsed)
    const progress = Math.min(100, (timeElapsed / goalSeconds) * 100)
    const percentage = Math.round(progress)
    const goalMet = percentage >= 60

    useEffect(() => {
        if (user) fetchGoal()
    }, [user])

    useEffect(() => {
        if (isActive) {
            if (timeElapsed >= goalSeconds) {
                handleAutoComplete()
                return
            }
            intervalRef.current = setInterval(() => {
                setTimeElapsed(t => t + 1)
            }, 1000)
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [isActive, timeElapsed, goalSeconds])

    const fetchGoal = async () => {
        const { data } = await supabase
            .from('profiles')
            .select('meditation_goal_minutes')
            .eq('id', user!.id)
            .single()

        if (data?.meditation_goal_minutes) {
            setGoalMinutes(data.meditation_goal_minutes)
        }
    }

    const logSession = async (durationMinutes: number, goalMet: boolean) => {
        await supabase.from('meditation_logs').insert({
            user_id: user!.id,
            date: new Date().toISOString().split('T')[0],
            duration_minutes: durationMinutes,
            goal_met: goalMet,
            is_focus_mode: isFocusMode,
            notes: goalMet
                ? `Objetivo completo (${percentage}%)`
                : `Sessão pausada (${percentage}%)`
        })
    }

    const start = () => setIsActive(true)

    const stop = async () => {
        setIsActive(false)
        if (intervalRef.current) clearInterval(intervalRef.current)

        const durationMinutes = Math.floor(timeElapsed / 60)
        const met = goalMet

        await logSession(durationMinutes, met)
        setSessionComplete(true)

        if (met) {
            reset()
        }

        return { met, percentage }
    }

    const handleAutoComplete = async () => {
        setIsActive(false)
        if (intervalRef.current) clearInterval(intervalRef.current)
        await logSession(goalMinutes, true)
        setSessionComplete(true)
        reset()
    }

    const reset = () => {
        setTimeElapsed(0)
        setSessionComplete(false)
    }

    const formatTime = (seconds: number) => {
        const min = Math.floor(seconds / 60)
        const sec = seconds % 60
        return `${min}:${sec < 10 ? '0' : ''}${sec}`
    }

    return {
        goalMinutes,
        timeElapsed,
        timeLeft,
        isActive,
        isFocusMode,
        setIsFocusMode,
        progress,
        percentage,
        goalMet,
        sessionComplete,
        start,
        stop,
        reset,
        formatTime
    }
}
