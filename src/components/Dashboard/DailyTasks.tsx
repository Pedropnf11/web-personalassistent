import { CircleDot, Check, PartyPopper } from 'lucide-react'
import type { DashboardTask } from '../../hooks/useDashboard'

interface DailyTasksProps {
    todos: DashboardTask[]
    toggleTodo: (id: string, currentStatus: boolean) => void
    completedCount: number
    totalCount: number
}

function DailyTasks({ todos, toggleTodo, completedCount, totalCount }: DailyTasksProps) {
    return (
        <div className="card-elevated">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <CircleDot className="text-green-neon" size={24} />
                BASE DIÁRIA (Obrigatórias)
            </h3>

            <div className="space-y-4">
                {todos.map(todo => (
                    <div
                        key={todo.id}
                        className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-200
              ${todo.completed
                                ? 'bg-green-premium/10 border-green-premium'
                                : 'bg-cave-medium border-gray-700 hover:border-gray-600'
                            }`}
                    >
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo.id, todo.completed)}
                            className="checkbox"
                        />
                        <div className="flex-1">
                            <div className={`font-semibold text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                                {todo.title}
                            </div>
                            {todo.duration && (
                                <div className="text-sm text-gray-400 mt-1">
                                    {todo.duration}
                                </div>
                            )}
                        </div>
                        {todo.completed && (
                            <span className="badge-success">
                                Completo <Check size={16} />
                            </span>
                        )}
                    </div>
                ))}
                {todos.length === 0 && (
                    <div className="text-center text-gray-500 py-4">
                        Sem tarefas para hoje. Relaxa ou adiciona algo na Rotina!
                    </div>
                )}
            </div>

            {/* Action Message */}
            {totalCount > 0 && completedCount === totalCount && (
                <div className="mt-6 p-4 bg-green-premium/20 border-2 border-green-premium rounded-lg text-center animate-glow">
                    <div className="text-xl font-bold text-green-neon flex items-center justify-center gap-2">
                        <PartyPopper /> Dia perfeito! Streak incrementado!
                    </div>
                </div>
            )}

            {completedCount < totalCount && (
                <div className="mt-6 p-4 bg-cave-dark border border-gray-700 rounded-lg text-center">
                    <div className="text-gray-400">
                        Faltam <span className="text-green-premium font-bold">{totalCount - completedCount}</span> tarefa(s) para completar o dia
                    </div>
                </div>
            )}
        </div>
    )
}

export default DailyTasks
