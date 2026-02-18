import { useState } from 'react'
import { Plus, Video, Edit2, Dumbbell, Play, Lock } from 'lucide-react'
import WorkoutPlayer from '../components/Treino/WorkoutPlayer'
import { useTreino, WorkoutPlan, WorkoutFormData } from '../hooks/useTreino'

const WEEKDAYS = [
    { id: 'seg', label: 'Seg', full: 'Segunda-feira' },
    { id: 'ter', label: 'Ter', full: 'Terça-feira' },
    { id: 'qua', label: 'Qua', full: 'Quarta-feira' },
    { id: 'qui', label: 'Qui', full: 'Quinta-feira' },
    { id: 'sex', label: 'Sex', full: 'Sexta-feira' },
    { id: 'sab', label: 'Sáb', full: 'Sábado' },
    { id: 'dom', label: 'Dom', full: 'Domingo' },
]

function TreinoPage() {
    const { workoutPlans, trainingDaysGoal, isLocked, getPlanForDay, savePlan, logWorkout, DEFAULT_FORM } = useTreino()

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null)
    const [isPlayerOpen, setIsPlayerOpen] = useState(false)
    const [formData, setFormData] = useState<WorkoutFormData>(DEFAULT_FORM)

    const handleCreateWorkout = () => {
        if (isLocked) {
            alert('Você já editou seus treinos este mês. Pode editar novamente na reflexão mensal.')
            return
        }
        if (workoutPlans.length >= trainingDaysGoal) {
            alert(`Você já criou ${trainingDaysGoal} treinos (limite do seu plano). Edite ou remova um existente.`)
            return
        }
        setFormData(DEFAULT_FORM)
        setSelectedPlan(null)
        setIsCreateModalOpen(true)
    }

    const handleEditWorkout = (plan: WorkoutPlan) => {
        if (isLocked) {
            alert('Você já editou seus treinos este mês. Pode editar novamente na reflexão mensal.')
            return
        }
        setFormData({
            name: plan.name,
            day_of_week: plan.day_of_week,
            video_url: plan.video_url || '',
            exercises: plan.exercises || [{ name: '', sets: 3, reps: '10' }]
        })
        setSelectedPlan(plan)
        setIsCreateModalOpen(true)
    }

    const handleSaveWorkout = async () => {
        if (!formData.name || !formData.day_of_week) {
            alert('Preencha o nome e selecione o dia da semana')
            return
        }
        if (!formData.exercises.length || !formData.exercises[0].name) {
            alert('Adicione pelo menos um exercício')
            return
        }
        if (!selectedPlan && getPlanForDay(formData.day_of_week)) {
            alert('Este dia já tem um treino. Edite o existente.')
            return
        }

        const ok = await savePlan(formData, selectedPlan)
        if (ok) {
            alert(selectedPlan ? 'Treino atualizado!' : 'Treino criado!')
            setIsCreateModalOpen(false)
            setSelectedPlan(null)
        }
    }

    const handleStartWorkout = (plan: WorkoutPlan) => {
        setSelectedPlan(plan)
        setIsPlayerOpen(true)
    }

    const handleWorkoutComplete = async (completedExercises: number, totalExercises: number) => {
        if (!selectedPlan) return
        const rate = await logWorkout(selectedPlan, completedExercises, totalExercises)
        setIsPlayerOpen(false)
        if (rate >= 0.5) {
            alert(`Treino concluído! 💪 Você completou ${Math.round(rate * 100)}% dos exercícios.`)
        } else {
            alert(`Treino registrado. Você completou ${Math.round(rate * 100)}%. Precisa de pelo menos 50% para contar como completo.`)
        }
    }

    const addExercise = () => {
        setFormData({ ...formData, exercises: [...formData.exercises, { name: '', sets: 3, reps: '10' }] })
    }

    const updateExercise = (index: number, field: keyof WorkoutFormData['exercises'][0], value: any) => {
        const updated = [...formData.exercises]
        updated[index] = { ...updated[index], [field]: value }
        setFormData({ ...formData, exercises: updated })
    }

    const removeExercise = (index: number) => {
        setFormData({ ...formData, exercises: formData.exercises.filter((_, i) => i !== index) })
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {isPlayerOpen && selectedPlan && (
                <WorkoutPlayer workout={selectedPlan} onClose={handleWorkoutComplete} />
            )}

            <div className="flex justify-between items-start mb-10">
                <div>
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-premium mb-2">
                        <Dumbbell className="inline mb-1 mr-2" size={32} />
                        Plano Semanal
                    </h1>
                    <p className="text-gray-400">
                        {workoutPlans.length}/{trainingDaysGoal} dias de treino configurados
                    </p>
                    {isLocked && (
                        <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                            <Lock size={14} />
                            Treinos bloqueados até a reflexão mensal
                        </p>
                    )}
                </div>
                <button
                    onClick={handleCreateWorkout}
                    className="btn-primary flex items-center gap-2"
                    disabled={workoutPlans.length >= trainingDaysGoal || isLocked}
                >
                    <Plus size={20} /> Criar Treino
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {WEEKDAYS.map((day) => {
                    const plan = getPlanForDay(day.id)
                    const hasWorkout = !!plan

                    return (
                        <div
                            key={day.id}
                            className={`card-premium p-6 transition-all ${hasWorkout
                                ? 'cursor-pointer hover:border-primary/50 hover:scale-105'
                                : 'opacity-60'
                                }`}
                            onClick={() => hasWorkout && handleStartWorkout(plan)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-sm font-bold text-primary uppercase tracking-wide">
                                    {day.label}
                                </span>
                                {hasWorkout && !isLocked && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleEditWorkout(plan) }}
                                        className="text-gray-500 hover:text-primary transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                )}
                                {isLocked && <Lock size={14} className="text-gray-600" />}
                            </div>

                            {hasWorkout ? (
                                <>
                                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{plan.name}</h3>
                                    <p className="text-sm text-gray-400 mb-3">{plan.exercises?.length || 0} exercícios</p>
                                    {plan.video_url && (
                                        <div className="flex items-center gap-2 text-xs text-primary">
                                            <Video size={14} /> Vídeo
                                        </div>
                                    )}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleStartWorkout(plan) }}
                                        className="w-full mt-4 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg px-3 py-2 text-sm font-semibold transition-all flex items-center justify-center gap-2"
                                    >
                                        <Play size={14} /> Treinar
                                    </button>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-600 text-sm font-semibold">Descanso</p>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {isCreateModalOpen && (
                <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
                    <div
                        className="bg-void-card border border-void-border rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">
                            {selectedPlan ? 'Editar Treino' : 'Criar Treino'}
                        </h2>

                        <div className="mb-4">
                            <label className="block text-sm text-gray-400 mb-2">Nome do Treino</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="input-premium w-full"
                                placeholder="Ex: Peito + Tríceps"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm text-gray-400 mb-2">Dia da Semana</label>
                            <select
                                value={formData.day_of_week}
                                onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
                                className="input-premium w-full bg-void-dark text-white"
                            >
                                <option value="">Selecione...</option>
                                {WEEKDAYS.map(day => (
                                    <option key={day.id} value={day.id}>{day.full}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm text-gray-400 mb-2">Link do Vídeo (opcional)</label>
                            <input
                                type="url"
                                value={formData.video_url}
                                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                                className="input-premium w-full"
                                placeholder="https://youtube.com/..."
                            />
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Exercícios</h3>
                            <div className="space-y-3">
                                {formData.exercises.map((exercise, idx) => (
                                    <div key={idx} className="bg-void-dark p-4 rounded-xl border border-void-border">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs text-gray-500">Exercício {idx + 1}</span>
                                            {formData.exercises.length > 1 && (
                                                <button onClick={() => removeExercise(idx)} className="text-red-500 text-xs hover:text-red-400">
                                                    Remover
                                                </button>
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            value={exercise.name}
                                            onChange={(e) => updateExercise(idx, 'name', e.target.value)}
                                            className="input-premium w-full mb-2"
                                            placeholder="Nome (ex: Supino reto)"
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="number"
                                                value={exercise.sets}
                                                onChange={(e) => updateExercise(idx, 'sets', parseInt(e.target.value))}
                                                className="input-premium"
                                                placeholder="Séries"
                                                min="1"
                                            />
                                            <input
                                                type="text"
                                                value={exercise.reps}
                                                onChange={(e) => updateExercise(idx, 'reps', e.target.value)}
                                                className="input-premium"
                                                placeholder="Reps (ex: 10-12)"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={addExercise}
                                className="w-full mt-3 bg-void-dark hover:bg-void-border text-white rounded-xl px-4 py-3 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={18} /> Adicionar Exercício
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => { setIsCreateModalOpen(false); setSelectedPlan(null) }}
                                className="flex-1 bg-void-dark hover:bg-void-border text-white rounded-xl px-4 py-3 transition-all"
                            >
                                Cancelar
                            </button>
                            <button onClick={handleSaveWorkout} className="flex-1 btn-primary">
                                {selectedPlan ? 'Atualizar' : 'Criar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TreinoPage
