import { useState } from 'react'
import Header from '../components/Dashboard/Header'
import ProgressCard from '../components/Dashboard/ProgressCard'
import DailyTasks from '../components/Dashboard/DailyTasks'
import QuickStats from '../components/Dashboard/QuickStats'

function DashboardPage() {
    const [todos, setTodos] = useState([
        { id: 1, title: '💪 Treino: Peito + Tríceps', duration: '60min', completed: false, pillar: 'saude' },
        { id: 2, title: '📖 Curso React - Módulo 5', duration: '2h', completed: false, pillar: 'estudo' },
        { id: 3, title: '📚 Leitura: Deep Work', duration: '30min', completed: false, pillar: 'mente' },
        { id: 4, title: '🧘 Meditação', duration: '10min', completed: false, pillar: 'mente' },
    ])

    const [streak, setStreak] = useState(12)
    const [totalStreak, setTotalStreak] = useState(47)

    const toggleTodo = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ))
    }

    const completedCount = todos.filter(t => t.completed).length
    const totalCount = todos.length

    return (
        <>
            <Header streak={streak} totalStreak={totalStreak} />

            <main className="max-w-7xl mx-auto px-8 py-12">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-4xl font-bold text-white mb-2">
                        Bom dia, Pedro 👋
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Segunda, 16 Fevereiro 2026
                    </p>
                </div>

                <ProgressCard
                    completedCount={completedCount}
                    totalCount={totalCount}
                />

                <DailyTasks
                    todos={todos}
                    toggleTodo={toggleTodo}
                    completedCount={completedCount}
                    totalCount={totalCount}
                />

                <QuickStats />
            </main>
        </>
    )
}

export default DashboardPage
