import { useState } from 'react'
import { NotebookPen, PenTool, CheckCircle, XCircle } from 'lucide-react'

function JournalPage() {
    const [journalData, setJournalData] = useState({}) // Format: { "YYYY-MM-DD": boolean }

    // Default reflection questions
    const reflectionQuestions = [
        "1. Pelo que sou grato hoje?",
        "2. O que aprendi de novo ou em que melhorei?",
        "3. O que poderia ter feito melhor?"
    ]

    // Calendar Logic (Simplified for MVP - Current Month)
    const today = new Date()
    const currentMonth = today.toLocaleString('default', { month: 'long' })
    const currentYear = today.getFullYear()
    const daysInMonth = new Date(currentYear, today.getMonth() + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentYear, today.getMonth(), 1).getDay()

    const toggleDay = (day) => {
        const key = `${currentYear}-${today.getMonth() + 1}-${day}`
        setJournalData(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    return (
        <div className="p-8 space-y-8 animate-fadeIn">
            {/* Header */}
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                Diário & Reflexão <NotebookPen className="text-primary" size={32} />
            </h1>
            <p className="text-gray-400">A tua clareza mental começa aqui.</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Column: Reflection Prompts */}
                <div className="space-y-6">
                    <div className="bg-void-card border border-void-border p-8 rounded-3xl relative overflow-hidden group hover:border-primary/50 transition-colors">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all" />

                        <h2 className="text-2xl font-bold text-white mb-6">Perguntas Diárias</h2>
                        <div className="space-y-6">
                            {reflectionQuestions.map((question, idx) => (
                                <div key={idx} className="bg-void-dark p-4 rounded-xl border border-white/5">
                                    <p className="text-gray-300 font-medium">{question}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 p-4 bg-accent-amber/10 border border-accent-amber/20 rounded-xl flex items-start gap-3">
                            <PenTool className="text-accent-amber" size={24} />
                            <div>
                                <p className="text-accent-amber font-bold text-sm mb-1">Ação Necessária</p>
                                <p className="text-gray-400 text-sm">Responde a estas perguntas no teu caderno físico. A escrita manual reforça a memória e a intenção.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Consistency Calendar */}
                <div className="bg-void-card border border-void-border p-8 rounded-3xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Consistência</h2>
                        <span className="text-primary font-mono text-sm uppercase tracking-widest">{currentMonth} {currentYear}</span>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(day => (
                            <div key={day} className="text-xs text-gray-500 font-bold p-2">{day}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {/* Empty cells for start of month */}
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square" />
                        ))}

                        {/* Days */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1
                            const dateKey = `${currentYear}-${today.getMonth() + 1}-${day}`
                            const isCompleted = journalData[dateKey]
                            const isToday = day === today.getDate()

                            return (
                                <button
                                    key={day}
                                    onClick={() => toggleDay(day)}
                                    className={`
                    aspect-square rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 relative group
                    ${isCompleted
                                            ? 'bg-primary text-white shadow-glow-purple border-primary'
                                            : 'bg-void-dark text-gray-500 border-void-border hover:border-gray-500 hover:text-white'
                                        }
                    ${isToday ? 'ring-2 ring-white ring-offset-2 ring-offset-void-dark' : ''}
                    border
                  `}
                                >
                                    {day}
                                    {isCompleted && (
                                        <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-primary pointer-events-none" />
                                    )}
                                </button>
                            )
                        })}
                    </div>

                    <div className="mt-6 flex justify-between text-sm text-gray-400 px-2">
                        <span className="flex items-center gap-1"><XCircle size={14} className="text-red-500" /> Não preenchido</span>
                        <span className="flex items-center gap-1 text-primary"><CheckCircle size={14} /> Preenchido</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JournalPage
