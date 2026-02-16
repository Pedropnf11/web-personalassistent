import { useState } from 'react'
import { User, Check, X, ChevronDown } from 'lucide-react'

function PerfilPage() {
    const [filter, setFilter] = useState('Geral')

    // Mock Data Generators
    const generateDays = (monthDays) => {
        return Array.from({ length: monthDays }, (_, i) => {
            const day = i + 1
            // Simulator logic based on filter
            let percentage = 0

            if (filter === 'Geral') {
                percentage = day % 7 === 0 ? 40 : (day % 3 === 0 ? 80 : 100)
            } else if (filter === 'Treino') {
                percentage = day % 2 === 0 ? 100 : 0 // Rest days or missed
            } else if (filter === 'Leitura') {
                percentage = day > 5 ? 100 : 50
            } else if (filter === 'Journaling') {
                percentage = 90
            } else if (filter === 'Água 1.5L') {
                percentage = day % 4 === 0 ? 30 : 100
            }

            return { day, percentage }
        })
    }

    const currentMonthDays = generateDays(28) // Feb 2026

    const getStatusColor = (percentage) => {
        if (percentage >= 75) return 'bg-gradient-premium shadow-glow-purple border-transparent text-white'
        return 'bg-void-dark border-2 border-void-border text-gray-600'
    }

    const getStatusIcon = (percentage) => {
        if (percentage >= 75) return <Check size={16} />
        return <X size={16} />
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">

            {/* Header Profile */}
            <div className="flex flex-col items-center justify-center mb-12 animate-float">
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-premium rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                    <div className="w-32 h-32 rounded-full p-[2px] bg-gradient-premium relative z-10">
                        <div className="w-full h-full bg-void-obsidian rounded-full flex items-center justify-center overflow-hidden border-4 border-void-obsidian">
                            <User size={64} className="text-white" />
                        </div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 border-4 border-void-obsidian rounded-full z-20" title="Online"></div>
                </div>

                <h1 className="text-4xl font-bold text-white mt-6 mb-1 tracking-tight">Pedro</h1>
                <div className="flex items-center gap-2 text-primary-glow font-medium bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    <span className="w-2 h-2 rounded-full bg-primary-glow animate-pulse"></span>
                    High Performer
                </div>
                <p className="text-gray-500 mt-4 text-sm uppercase tracking-widest font-medium">
                    Membro desde <span className="text-white">01 Jan 2026</span>
                </p>
            </div>

            {/* Filter & Calendar Section */}
            <div className="card-glass relative overflow-hidden">
                {/* Decorative Background Blur */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 relative z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Histórico de Hábitos</h2>
                        <p className="text-gray-400 text-sm">Visualização Mensal • Fevereiro 2026</p>
                    </div>

                    {/* Filter Dropdown */}
                    <div className="relative group min-w-[180px]">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full appearance-none bg-void-dark border border-void-border text-white px-4 py-2 pr-10 rounded-xl focus:outline-none focus:border-primary cursor-pointer hover:border-white/20 transition-colors"
                        >
                            <option>Geral</option>
                            <option>Treino</option>
                            <option>Leitura</option>
                            <option>Journaling</option>
                            <option>Água 1.5L</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <ChevronDown size={16} />
                        </div>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-4 mb-4">
                    {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => (
                        <div key={i} className="text-center text-gray-500 font-bold text-xs uppercase mb-2">
                            {d}
                        </div>
                    ))}

                    {/* Empty days for start of month (assuming Feb starts on Sunday for visual balance or use date logic later) */}
                    {/* Just filling mockup days */}
                    {currentMonthDays.map((stat) => (
                        <div key={stat.day} className="flex flex-col items-center gap-1 group">
                            <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 relative
                        ${getStatusColor(stat.percentage)}
                        ${stat.percentage < 75 ? 'hover:border-accent-rose hover:text-accent-rose' : ''}
                    `}>
                                {getStatusIcon(stat.percentage)}

                                {/* Tooltip on Hover */}
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-void-dark border border-void-border px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                                    {stat.percentage}% Concluído
                                </div>
                            </div>
                            <span className={`text-[10px] font-medium ${stat.percentage >= 75 ? 'text-white/60' : 'text-gray-600'}`}>
                                {stat.day}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-6 mt-6 border-t border-white/5 pt-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-premium shadow-glow-purple"></div>
                        <span className="text-xs text-gray-400">Sucesso ({'>'}75%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-void-dark border border-void-border"></div>
                        <span className="text-xs text-gray-400">Falha ({'<'}75%)</span>
                    </div>
                </div>
            </div>

            {/* Stats Summary - Based on Filter */}
            <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="card-premium p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                        {currentMonthDays.filter(d => d.percentage >= 75).length}
                    </div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest">Dias Positivos</div>
                </div>
                <div className="card-premium p-4 text-center">
                    <div className="text-2xl font-bold text-primary-glow mb-1">
                        {filter === 'Geral' ? '82%' : '94%'}
                    </div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest">Performance</div>
                </div>
                <div className="card-premium p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                        12
                    </div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest">Melhor Streak</div>
                </div>
            </div>
        </div>
    )
}

export default PerfilPage
