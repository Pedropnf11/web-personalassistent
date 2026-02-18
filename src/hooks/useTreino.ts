import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export interface Exercise {
    name: string
    sets: number
    reps: string
}

export interface WorkoutPlan {
    id: string
    user_id: string
    name: string
    day_of_week: string
    exercises: Exercise[]
    video_url?: string
    last_edited_at: string
    last_edited_month?: string
    created_at: string
}

export interface WorkoutFormData {
    name: string
    day_of_week: string
    video_url: string
    exercises: Exercise[]
}

const DEFAULT_FORM: WorkoutFormData = {
    name: '',
    day_of_week: '',
    video_url: '',
    exercises: [{ name: '', sets: 3, reps: '10' }]
}

export function useTreino() {
    const { user } = useAuth()
    const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([])
    const [trainingDaysGoal, setTrainingDaysGoal] = useState(3)
    const [isLocked, setIsLocked] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user) {
            fetchUserProfile()
            fetchWorkoutPlans()
        }
    }, [user])

    const fetchUserProfile = async () => {
        const { data } = await supabase
            .from('profiles')
            .select('training_days_goal')
            .eq('id', user!.id)
            .single()

        if (data) {
            setTrainingDaysGoal(data.training_days_goal || 3)
        }
    }

    const fetchWorkoutPlans = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('workout_plans')
            .select('*')
            .eq('user_id', user!.id)

        if (!error && data) {
            setWorkoutPlans(data)
            checkIfLocked(data)
        }
        setLoading(false)
    }

    const checkIfLocked = (plans: WorkoutPlan[]) => {
        if (plans.length >= trainingDaysGoal && trainingDaysGoal > 0) {
            const currentMonth = new Date().toISOString().slice(0, 7)
            const anyEditedThisMonth = plans.some(p => p.last_edited_month === currentMonth)
            setIsLocked(anyEditedThisMonth)
        } else {
            setIsLocked(false)
        }
    }

    const getPlanForDay = (dayId: string) =>
        workoutPlans.find(p => p.day_of_week === dayId)

    const savePlan = async (formData: WorkoutFormData, selectedPlan: WorkoutPlan | null): Promise<boolean> => {
        if (!formData.name || !formData.day_of_week) return false
        if (!formData.exercises.length || !formData.exercises[0].name) return false

        const currentMonth = new Date().toISOString().slice(0, 7)

        if (selectedPlan) {
            const { error } = await supabase
                .from('workout_plans')
                .update({
                    name: formData.name,
                    day_of_week: formData.day_of_week,
                    video_url: formData.video_url || null,
                    exercises: formData.exercises,
                    last_edited_at: new Date().toISOString(),
                    last_edited_month: currentMonth
                })
                .eq('id', selectedPlan.id)

            if (error) return false
        } else {
            const { error } = await supabase
                .from('workout_plans')
                .insert({
                    user_id: user!.id,
                    name: formData.name,
                    day_of_week: formData.day_of_week,
                    video_url: formData.video_url || null,
                    exercises: formData.exercises,
                    last_edited_month: currentMonth
                })

            if (error) return false
        }

        await fetchWorkoutPlans()
        return true
    }

    const logWorkout = async (plan: WorkoutPlan, completedExercises: number, totalExercises: number) => {
        const completionRate = completedExercises / totalExercises
        await supabase.from('workout_logs').insert({
            user_id: user!.id,
            plan_id: plan.id,
            date: new Date().toISOString().split('T')[0],
            duration_minutes: 45, // TODO: track real duration
            notes: `Completou ${completedExercises}/${totalExercises} exercícios (${Math.round(completionRate * 100)}%)`
        })
        return completionRate
    }

    return {
        workoutPlans,
        trainingDaysGoal,
        isLocked,
        loading,
        getPlanForDay,
        savePlan,
        logWorkout,
        refetch: fetchWorkoutPlans,
        DEFAULT_FORM
    }
}
