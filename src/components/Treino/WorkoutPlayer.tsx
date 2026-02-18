import { useState, useEffect } from 'react'
import { MonitorPlay, Zap, Play, Pause, RotateCcw, Dumbbell, X, ChevronRight, CheckCircle } from 'lucide-react'

interface Exercise {
    name: string
    sets: number
    reps: string
}

interface WorkoutPlayerProps {
    workout: {
        name: string
        exercises: Exercise[]
        video_url?: string
    }
    onClose: (completedExercises: number, totalExercises: number) => void
}

function WorkoutPlayer({ workout, onClose }: WorkoutPlayerProps) {
    const [mode, setMode] = useState<'video' | 'guided' | null>(null)
    const [showGuidedPreview, setShowGuidedPreview] = useState(false)

    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
    const [completedExercises, setCompletedExercises] = useState<number[]>([])
    const [isTimerRunning, setIsTimerRunning] = useState(false)
    const [timeLeft, setTimeLeft] = useState(60)

    // Use exercises from the workout
    const exercises = workout.exercises || []

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isTimerRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((t) => t - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            setIsTimerRunning(false)
        }
        return () => clearInterval(interval)
    }, [isTimerRunning, timeLeft])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const toggleTimer = () => setIsTimerRunning(!isTimerRunning)

    const resetTimer = (seconds = 60) => {
        setIsTimerRunning(false)
        setTimeLeft(seconds)
    }

    const markExerciseComplete = () => {
        if (!completedExercises.includes(currentExerciseIndex)) {
            setCompletedExercises([...completedExercises, currentExerciseIndex])
        }
    }

    const nextExercise = () => {
        markExerciseComplete()

        if (currentExerciseIndex < exercises.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1)
            resetTimer(60)
        } else {
            // Workout finished
            finishWorkout()
        }
    }

    const skipExercise = () => {
        if (currentExerciseIndex < exercises.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1)
            resetTimer(60)
        } else {
            finishWorkout()
        }
    }

    const finishWorkout = () => {
        const completed = completedExercises.length + 1 // +1 for current if completing
        onClose(completed, exercises.length)
    }

    const handleClose = () => {
        onClose(completedExercises.length, exercises.length)
    }

    const startGuidedWorkout = () => {
        setShowGuidedPreview(false)
    }

    const renderModeSelection = () => (
        <div className="flex flex-col items-center justify-center h-full space-y-8 animate-float">
            <h2 className="text-3xl font-bold text-white text-center">Como queres treinar hoje?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl px-4">
                {workout.video_url && (
                    <button
                        onClick={() => setMode('video')}
                        className="group relative overflow-hidden rounded-3xl aspect-video bg-void-card border border-void-border hover:border-primary transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" />
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700" />

                        <div className="relative z-20 flex flex-col items-center justify-center h-full">
                            <MonitorPlay size={48} className="mb-4 group-hover:scale-110 transition-transform duration-300 text-white" />
                            <span className="text-2xl font-bold text-white">Vídeo Aula</span>
                            <span className="text-sm text-gray-300 mt-2">Seguir instrutor</span>
                        </div>
                    </button>
                )}

                <button
                    onClick={() => {
                        setMode('guided')
                        setShowGuidedPreview(true)
                    }}
                    className="group relative overflow-hidden rounded-3xl aspect-video bg-void-card border border-void-border hover:border-accent-cyan transition-all duration-300"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" />
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-110 transition-transform duration-700" />

                    <div className="relative z-20 flex flex-col items-center justify-center h-full">
                        <Zap size={48} className="mb-4 group-hover:scale-110 transition-transform duration-300 text-white" />
                        <span className="text-2xl font-bold text-white">Treino Guiado</span>
                        <span className="text-sm text-gray-300 mt-2">Cronômetro + Lista</span>
                    </div>
                </button>
            </div>
        </div>
    )

    const getYouTubeEmbedUrl = (url: string) => {
        const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]
        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url
    }

    const renderVideoMode = () => (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-glow-purple border border-void-border relative">
                <iframe
                    width="100%"
                    height="100%"
                    src={getYouTubeEmbedUrl(workout.video_url || '')}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
            <button onClick={() => setMode(null)} className="mt-6 btn-ghost text-white flex items-center gap-2">
                <ChevronRight className="rotate-180" size={20} /> Voltar à escolha
            </button>
        </div>
    )

    const renderGuidedPreview = () => (
        <div className="w-full max-w-2xl mx-auto h-full flex flex-col justify-center p-8 animate-fadeIn">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">{workout.name}</h2>
                <p className="text-primary-glow">Prepara-te para começar.</p>
            </div>

            <div className="bg-void-card border border-void-border rounded-3xl p-6 mb-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <h3 className="text-gray-400 text-sm uppercase tracking-widest mb-4">Lista de Exercícios</h3>
                <div className="space-y-4">
                    {exercises.map((ex, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-void-dark rounded-xl border border-white/5 hover:border-primary/30 transition-colors">
                            <div className="flex items-center gap-4">
                                <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                                    {index + 1}
                                </span>
                                <div>
                                    <h4 className="font-bold text-white">{ex.name}</h4>
                                    <p className="text-xs text-gray-500">{ex.sets} séries</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-primary-glow font-mono font-bold">{ex.sets}x{ex.reps}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={startGuidedWorkout}
                className="btn-primary w-full py-4 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
            >
                COMEÇAR TREINO
            </button>

            <button
                onClick={() => setMode(null)}
                className="mt-4 text-gray-500 hover:text-white text-sm text-center w-full transition-colors"
            >
                Cancelar
            </button>
        </div>
    )

    const renderGuidedActive = () => {
        const exercise = exercises[currentExerciseIndex]

        return (
            <div className="w-full max-w-4xl mx-auto h-full flex flex-col p-4 animate-fadeIn">
                {/* Header / Progress */}
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-gray-400">Exercício {currentExerciseIndex + 1} de {exercises.length}</h3>
                    <div className="flex gap-1">
                        {exercises.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 w-8 rounded-full transition-colors ${completedExercises.includes(i)
                                        ? 'bg-primary'
                                        : i === currentExerciseIndex
                                            ? 'bg-primary/50'
                                            : 'bg-white/10'
                                    }`}
                            />
                        ))}
                    </div>
                    <button onClick={handleClose} className="text-sm text-gray-500 hover:text-white">Sair</button>
                </div>

                {/* Exercise Content */}
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="bg-void-card border border-void-border rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden text-center w-full max-w-3xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 relative z-10 animate-slideUp">{exercise.name}</h2>
                        <div className="inline-block px-6 py-2 rounded-full bg-white/5 border border-white/10 text-2xl text-primary-glow font-mono font-bold mb-8 relative z-10 animate-slideUp delay-100">
                            {exercise.sets}x{exercise.reps}
                        </div>

                        {/* Timer Card */}
                        <div className="bg-void-dark rounded-2xl p-8 border border-white/5 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 max-w-2xl mx-auto hover:border-primary/30 transition-colors duration-300 relative z-10 animate-slideUp delay-300">
                            <div className="text-left">
                                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Cronômetro</p>
                                <p className="text-6xl font-mono font-bold text-white tabular-nums tracking-tighter">{formatTime(timeLeft)}</p>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={toggleTimer}
                                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 ${isTimerRunning ? 'bg-accent-amber text-black' : 'bg-primary text-white shadow-glow-purple'}`}
                                >
                                    {isTimerRunning ? <Pause size={32} className="text-black" /> : <Play size={32} className="text-white ml-1" />}
                                </button>
                                <button
                                    onClick={() => resetTimer()}
                                    className="w-20 h-20 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors transform hover:rotate-180 duration-500"
                                >
                                    <RotateCcw size={28} />
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 animate-slideUp delay-500">
                            <button
                                onClick={nextExercise}
                                className="btn-primary w-full max-w-md py-4 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-0.5 relative z-10"
                            >
                                {currentExerciseIndex === exercises.length - 1 ? (
                                    <span className="flex items-center gap-2 justify-center">Concluir Treino <CheckCircle size={20} /></span>
                                ) : (
                                    <span className="flex items-center gap-2 justify-center">Próximo Exercício <ChevronRight size={20} /></span>
                                )}
                            </button>

                            <button
                                onClick={skipExercise}
                                className="w-full max-w-md text-gray-500 hover:text-white transition-colors text-sm"
                            >
                                Pular exercício (não conta como completo)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-[100] bg-void-obsidian flex flex-col animate-[fadeIn_0.3s_ease-out]">
            {/* Top Bar Navigation */}
            <div className="px-8 py-4 border-b border-void-border flex justify-between items-center bg-void-dark">
                <div className="flex items-center gap-3">
                    <Dumbbell className="text-primary" size={24} />
                    <div>
                        <h1 className="font-bold text-white">{workout.name}</h1>
                        <p className="text-xs text-primary-glow">
                            {completedExercises.length}/{exercises.length} exercícios completos
                        </p>
                    </div>
                </div>
                <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {!mode && renderModeSelection()}
                {mode === 'video' && renderVideoMode()}
                {mode === 'guided' && showGuidedPreview && renderGuidedPreview()}
                {mode === 'guided' && !showGuidedPreview && renderGuidedActive()}
            </div>
        </div>
    )
}

export default WorkoutPlayer
