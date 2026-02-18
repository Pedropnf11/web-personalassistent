import { useDashboard, DashboardTask } from '../hooks/useDashboard'
import Header from '../components/Dashboard/Header'
import ProgressCard from '../components/Dashboard/ProgressCard'
import DailyTasks from '../components/Dashboard/DailyTasks'
import QuickStats from '../components/Dashboard/QuickStats'

function DashboardPage() {
    const { tasks, stats, userName, currentDate, loading, toggleTask } = useDashboard()

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-void-obsidian">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
                    <span className="text-gray-400 font-medium">Carregando seu dia...</span>
                </div>
            </div>
        )
    }

    const completedCount = tasks.filter(t => t.completed).length
    const totalCount = tasks.length

    // Format Date: "Segunda, 16 Fevereiro 2026"
    const formattedDate = currentDate.toLocaleDateString('pt-PT', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).replace(/^\w/, c => c.toUpperCase()) // Capitalize first letter

    return (
        <div className="min-h-screen pb-20">
            <Header streak={stats.streak} totalStreak={stats.totalStreak} />

            <main className="max-w-7xl mx-auto px-8 py-12">
                {/* Welcome Section */}
                <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                    <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">
                        Bom dia, <span className="text-transparent bg-clip-text bg-gradient-premium">{userName || 'Guerreiro'}</span> 👋
                    </h2>
                    <p className="text-gray-400 text-lg capitalize">
                        {formattedDate}
                    </p>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    <ProgressCard
                        completedCount={completedCount}
                        totalCount={totalCount}
                    />
                </div>

                <div className="mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    <DailyTasks
                        todos={tasks}
                        toggleTodo={toggleTask}
                        completedCount={completedCount}
                        totalCount={totalCount}
                    />
                </div>

                <div className="mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
                    <QuickStats />
                </div>
            </main>
        </div>
    )
}

export default DashboardPage
