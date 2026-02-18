import { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { CheckCircle2, Trash2, CalendarDays, Plus, Clock, Repeat, X, Quote } from 'lucide-react'
import { useRotina } from '../hooks/useRotina'
import type { Task } from '../hooks/useRotina'

function RotinaPage() {
    const [date, setDate] = useState<Date>(new Date())
    const [isModalOpen, setIsModalOpen] = useState(false)

    const { nonNegotiableTasks, optionalTasks, tasks, userSettings, loading, addTask, toggleTask, deleteTask } = useRotina(date)

    // Form State
    const [newTaskTitle, setNewTaskTitle] = useState('')
    const [newTaskType, setNewTaskType] = useState<Task['type']>('non-negotiable')
    const [newTaskTime, setNewTaskTime] = useState('')
    const [isRecurring, setIsRecurring] = useState(false)

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault()
        const ok = await addTask(newTaskTitle, newTaskType, newTaskTime, isRecurring, date)
        if (ok) {
            setNewTaskTitle('')
            setNewTaskTime('')
            setIsRecurring(false)
            setIsModalOpen(false)
        }
    }

    const openModal = (type: Task['type']) => {
        setNewTaskType(type)
        setIsModalOpen(true)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-gray-500">A carregar...</div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-8 py-12 space-y-12 relative">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Minha Rotina</h2>
                    <p className="text-gray-400">Gerencie seus hábitos, tarefas e calendário.</p>
                </div>
                <div className="bg-void-card/50 px-4 py-2 rounded-xl border border-void-border/50 text-white">
                    {date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
            </header>

            {/* Remember Me / Principles Section */}
            {userSettings?.rememberPhrases && userSettings.rememberPhrases.length > 0 && (
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 blur-3xl opacity-30 pointer-events-none" />
                    <div className="relative bg-void-card/30 backdrop-blur-sm border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-2xl">
                        <div className="absolute -top-4 -left-2 text-primary/20 rotate-180">
                            <Quote size={48} fill="currentColor" />
                        </div>
                        <div className="absolute -bottom-4 -right-2 text-primary/20">
                            <Quote size={48} fill="currentColor" />
                        </div>
                        <div className="flex flex-wrap justify-center gap-6 relative z-10">
                            {userSettings.rememberPhrases.filter((p: string) => p).map((phrase: string, idx: number) => (
                                <div key={idx} className="max-w-md">
                                    <h3 className="text-xl md:text-2xl font-light italic text-gray-200 leading-relaxed tracking-wide">
                                        "{phrase}"
                                    </h3>
                                    <div className="mt-2 w-12 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto opacity-50" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Tasks Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Non-Negotiable Column */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                            Não Negociáveis
                        </h3>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500 font-medium">
                                {nonNegotiableTasks.filter(t => t.completed).length}/{nonNegotiableTasks.length} Done
                            </span>
                            <button onClick={() => openModal('non-negotiable')} className="bg-primary/10 hover:bg-primary/20 text-primary rounded-lg p-2 transition-colors">
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {nonNegotiableTasks.map(task => (
                            <div
                                key={task.id}
                                className={`
                                    group flex items-center justify-between p-4 rounded-xl border transition-all duration-300
                                    ${task.completed
                                        ? 'bg-void-card/30 border-primary/20 opacity-75'
                                        : 'bg-void-card border-void-border hover:border-primary/30 hover:translate-x-1'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-4 w-full">
                                    <button
                                        onClick={() => toggleTask(task.id, task.completed)}
                                        className={`
                                            flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                                            ${task.completed
                                                ? 'bg-primary border-primary text-white scale-110'
                                                : 'border-gray-600 hover:border-primary'
                                            }
                                        `}
                                    >
                                        {task.completed && <CheckCircle2 size={14} strokeWidth={4} />}
                                    </button>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-lg font-medium transition-all ${task.completed ? 'text-gray-500 line-through decoration-gray-600' : 'text-white'}`}>
                                                {task.title}
                                            </span>
                                            {task.isRecurring && <Repeat size={14} className="text-gray-500" />}
                                        </div>
                                        {task.time && (
                                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                                <Clock size={12} />
                                                <span>{task.time}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="text-gray-600 hover:text-primary opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-white/5 rounded-lg flex-shrink-0"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Optional Column */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-gray-600 shadow-[0_0_10px_rgba(75,85,99,0.5)]"></div>
                            Opcionais
                        </h3>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500 font-medium">Desaparecem ao completar</span>
                            <button onClick={() => openModal('optional')} className="bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg p-2 transition-colors">
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {optionalTasks.map(task => (
                            <div
                                key={task.id}
                                className="group flex items-center justify-between p-4 rounded-xl border border-void-border bg-void-card hover:border-gray-500/30 text-white transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/5 hover:-translate-y-1"
                            >
                                <div className="flex items-center gap-4 w-full">
                                    <button
                                        onClick={() => toggleTask(task.id, task.completed)}
                                        className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-600 hover:border-gray-400 transition-colors"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-medium">{task.title}</span>
                                            {task.isRecurring && <Repeat size={14} className="text-gray-500" />}
                                        </div>
                                        {task.time && (
                                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                                <Clock size={12} />
                                                <span>{task.time}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="text-gray-600 hover:text-white opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-white/5 rounded-lg flex-shrink-0"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        {optionalTasks.length === 0 && (
                            <div className="p-8 border-2 border-dashed border-void-border rounded-xl flex flex-col items-center justify-center text-gray-600 gap-2">
                                <CheckCircle2 size={32} />
                                <p>Tudo limpo por aqui!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Calendar */}
            <div className="bg-void-card border border-void-border rounded-2xl p-6 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <CalendarDays className="text-primary" size={32} />
                        <h3 className="text-2xl font-bold text-white">Agenda</h3>
                    </div>
                    <button onClick={() => openModal('optional')} className="btn-primary py-2 px-4 text-sm flex items-center gap-2">
                        <Plus size={16} /> Novo Evento
                    </button>
                </div>

                <div className="calendar-google-style">
                    <Calendar
                        onChange={setDate as any}
                        value={date}
                        className="w-full bg-transparent text-white border-none font-sans"
                        tileContent={({ date: tileDate, view }) => {
                            if (view === 'month') {
                                const dayTasks = tasks.filter(t => {
                                    if (t.isRecurring) return true
                                    if (!t.date) return false
                                    const tDate = new Date(t.date)
                                    return tDate.getDate() === tileDate.getDate() &&
                                        tDate.getMonth() === tileDate.getMonth() &&
                                        tDate.getFullYear() === tileDate.getFullYear()
                                })
                                if (dayTasks.length > 0) {
                                    return (
                                        <div className="flex flex-col gap-1 mt-1">
                                            {dayTasks.slice(0, 3).map((t, i) => (
                                                <div key={i} className={`text-[10px] px-1 rounded truncate ${t.type === 'non-negotiable' ? 'bg-primary/20 text-primary-glow' : 'bg-gray-700/50 text-gray-300'}`}>
                                                    {t.time ? t.time + ' ' : ''}{t.title}
                                                </div>
                                            ))}
                                            {dayTasks.length > 3 && (
                                                <div className="text-[9px] text-gray-500 pl-1">+{dayTasks.length - 3} mais</div>
                                            )}
                                        </div>
                                    )
                                }
                            }
                            return null
                        }}
                    />
                </div>
            </div>

            {/* Add Task Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative bg-[#1A1A1A] border border-void-border/50 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                            <X size={20} />
                        </button>

                        <h3 className="text-xl font-bold text-white mb-6">
                            Adicionar {newTaskType === 'non-negotiable' ? 'Obrigatória' : 'Opcional'}
                        </h3>

                        <form onSubmit={handleAddTask} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">O que você vai fazer?</label>
                                <input
                                    type="text"
                                    required
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    placeholder="Ex: Treinar Peito..."
                                    className="w-full bg-void-dark border border-void-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    autoFocus
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Tem hora marcada? (Opcional)</label>
                                <input
                                    type="time"
                                    value={newTaskTime}
                                    onChange={(e) => setNewTaskTime(e.target.value)}
                                    className="w-full bg-void-dark border border-void-border rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none scheme-dark"
                                />
                            </div>

                            <div
                                className="flex items-center gap-3 p-4 bg-void-card/50 rounded-xl border border-void-border/30 cursor-pointer hover:bg-void-card transition-colors"
                                onClick={() => setIsRecurring(!isRecurring)}
                            >
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isRecurring ? 'bg-primary border-primary' : 'border-gray-500'}`}>
                                    {isRecurring && <CheckCircle2 size={14} className="text-white" />}
                                </div>
                                <div className="flex-1">
                                    <span className="text-white font-medium block">Repetir todos os dias</span>
                                    <span className="text-xs text-gray-500">Aparece todos os dias na rotina</span>
                                </div>
                                <Repeat size={18} className="text-gray-500" />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-3 rounded-xl border border-void-border text-gray-300 hover:bg-white/5 transition-colors font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-premium text-white font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                                >
                                    Salvar Tarefa
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Calendar Styles */}
            <style>{`
                .calendar-google-style .react-calendar { background: transparent !important; border: none !important; width: 100% !important; font-family: inherit !important; }
                .calendar-google-style .react-calendar__navigation { display: flex; margin-bottom: 2rem; }
                .calendar-google-style .react-calendar__navigation button { color: white !important; min-width: 44px; background: none; font-size: 1.25rem; font-weight: bold; text-transform: capitalize; }
                .calendar-google-style .react-calendar__navigation button:disabled { background-color: transparent; }
                .calendar-google-style .react-calendar__month-view__weekdays { text-align: center; text-transform: uppercase; font-weight: bold; font-size: 0.9em; color: #94a3b8; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
                .calendar-google-style .react-calendar__month-view__weekdays__weekday abbr { text-decoration: none; }
                .calendar-google-style .react-calendar__month-view__days { display: grid !important; grid-template-columns: repeat(7, 1fr); }
                .calendar-google-style .react-calendar__tile { height: 120px; display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-start; padding: 4px !important; border-bottom: 1px solid rgba(255,255,255,0.05); border-right: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.01); transition: all 0.2s; text-align: left; overflow: hidden; }
                .calendar-google-style .react-calendar__tile:enabled:hover { background: rgba(255,255,255,0.05) !important; }
                .calendar-google-style .react-calendar__tile--now abbr { background: #a855f7; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
                .calendar-google-style .react-calendar__tile--active { background: rgba(168, 85, 247, 0.1) !important; color: white !important; }
                .react-calendar__tile abbr { font-weight: bold; font-size: 0.9rem; margin-bottom: 4px; margin-left: 4px; margin-top: 4px; }
                .react-calendar__month-view__days__day--neighboringMonth { color: #475569 !important; background: transparent !important; }
            `}</style>
        </div>
    )
}

export default RotinaPage
