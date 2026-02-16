import { useState } from 'react'
import { Plus, Check, MoreVertical, X } from 'lucide-react'
import WorkoutPlayer from '../components/Treino/WorkoutPlayer'

function TreinoPage() {
    const [workouts, setWorkouts] = useState([
        { day: 'Segunda', title: 'Peito + Tríceps', duration: '60min', status: 'Completed' },
        { day: 'Terça', title: 'Pernas + Glúteos', duration: '60min', status: 'Pending' },
        { day: 'Quarta', title: 'Descanso Ativo', duration: '-', status: 'Rest' },
        { day: 'Quinta', title: 'Costas + Bíceps', duration: '60min', status: 'Pending' },
        { day: 'Sexta', title: 'Ombros + Abs', duration: '45min', status: 'Pending' },
        { day: 'Sábado', title: 'Cardio HIIT', duration: '30min', status: 'Pending' },
        { day: 'Domingo', title: 'Descanso Total', duration: '-', status: 'Rest' },
    ])

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [activeWorkout, setActiveWorkout] = useState(null) // New state for player

    const handleAddWorkout = () => {
        // Logic to update state would go here
        setIsModalOpen(false)
        alert('Workout added! (Simulation)')
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Workout Player Overlay */}
            {activeWorkout && (
                <WorkoutPlayer
                    workout={activeWorkout}
                    onClose={() => setActiveWorkout(null)}
                />
            )}

            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Plano de Treino</h1>
                    <p className="text-gray-400">Fevereiro 2026</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
                    <Plus size={20} /> Adicionar Treino
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workouts.map((workout, index) => (
                    <div key={index} className={`card-premium group hover:border-primary/50 transition-all duration-300 ${workout.status === 'Completed' ? 'border-primary/30 bg-primary/5' : ''}`}>
                        <div className="flex justify-between items-start mb-4">
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-white/5 text-gray-300 border border-white/5">
                                {workout.day}
                            </span>
                            {workout.status === 'Completed' && (
                                <Check size={16} className="text-primary font-bold" />
                            )}
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-primary-glow transition-colors">
                            {workout.title}
                        </h3>
                        <p className="text-gray-500 font-mono text-sm">{workout.duration}</p>

                        {workout.status !== 'Rest' && (
                            <div className="mt-6 flex gap-2">
                                <button
                                    onClick={() => setActiveWorkout(workout)}
                                    className="flex-1 btn-primary text-sm shadow-none"
                                >
                                    Iniciar Treino
                                </button>
                                <button className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors">
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Add Workout Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="bg-void-card border border-void-border rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-float relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20} /></button>
                        <h2 className="text-2xl font-bold text-white mb-6">Adicionar Treino</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Dia da Semana</label>
                                <select className="input-premium w-full text-white bg-void-dark">
                                    <option>Segunda</option>
                                    <option>Terça</option>
                                    <option>Quarta</option>
                                    <option>Quinta</option>
                                    <option>Sexta</option>
                                    <option>Sábado</option>
                                    <option>Domingo</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Título do Treino</label>
                                <input type="text" className="input-premium w-full" placeholder="Ex: Peito + Ombros" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Duração</label>
                                <input type="text" className="input-premium w-full" placeholder="Ex: 60min" />
                            </div>
                        </div>

                        <div className="mt-8">
                            <button onClick={handleAddWorkout} className="btn-primary w-full">
                                Adicionar ao Plano
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TreinoPage
