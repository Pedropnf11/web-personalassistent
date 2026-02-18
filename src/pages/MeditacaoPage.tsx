import { Play, Square, Wind, Sparkles } from 'lucide-react'
import { useMeditacao } from '../hooks/useMeditacao'

function MeditacaoPage() {
    const {
        goalMinutes,
        timeElapsed,
        timeLeft,
        isActive,
        isFocusMode,
        setIsFocusMode,
        progress,
        percentage,
        goalMet,
        start,
        stop,
        formatTime
    } = useMeditacao()

    const handleStop = async () => {
        const result = await stop()
        if (result.met) {
            alert(`Parabéns! 🧘 Sessão concluída com ${result.percentage}% do objetivo.`)
        } else {
            alert(`Sessão pausada. Completaste ${result.percentage}%.\n\nPrecisas de pelo menos 60% para marcar como concluída.`)
        }
    }

    return (
        <div className="h-full flex flex-col items-center justify-center p-8 relative overflow-hidden font-sans">
            {/* Dynamic Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-cyan/10 rounded-full blur-[120px] transition-all duration-[5s] ${isActive ? 'scale-150 opacity-40' : 'scale-100 opacity-20'}`} />
                <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] animate-pulse-slow" />
            </div>

            <div className="z-10 text-center mb-10">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-premium tracking-tight flex items-center justify-center gap-3">
                    <Wind size={28} className={isActive ? 'animate-pulse' : ''} />
                    Meditation Flow
                </h1>
                <p className="text-gray-500 text-sm mt-2 font-medium tracking-wide">
                    {isActive ? 'Respira... Foca...' : 'Prepara a tua mente'}
                </p>
                <p className="text-primary text-xs mt-1">Objetivo: {goalMinutes} minutos</p>
            </div>

            {/* Main Circle UI */}
            <div className="relative z-10 mb-12">
                {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-64 h-64 rounded-full border border-primary/30 animate-[ping_4s_ease-in-out_infinite]" />
                        <div className="w-64 h-64 rounded-full border border-accent-cyan/20 animate-[ping_5s_ease-in-out_infinite_1s]" />
                    </div>
                )}

                <div className={`
                    w-72 h-72 rounded-full 
                    bg-void-card/40 backdrop-blur-xl border border-white/5
                    shadow-[0_0_50px_rgba(0,0,0,0.5)]
                    flex flex-col items-center justify-center relative overflow-hidden
                    transition-all duration-700
                    ${isActive ? 'scale-105 border-primary/30' : 'hover:border-white/20'}
                `}>
                    <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                        <circle cx="144" cy="144" r="140" fill="none" stroke="#334155" strokeWidth="2" />
                        <circle
                            cx="144" cy="144" r="140"
                            fill="none" stroke="#a855f7" strokeWidth="4"
                            strokeDasharray={880}
                            strokeDashoffset={880 - (880 * progress) / 100}
                            className="transition-all duration-1000 ease-linear"
                            strokeLinecap="round"
                        />
                    </svg>

                    <div className="relative z-20 flex flex-col items-center">
                        {isFocusMode && isActive ? (
                            <div className="animate-pulse-slow">
                                <Sparkles size={48} className="text-primary-glow mb-4 opacity-80" />
                                <span className="text-xs text-primary-glow/70 uppercase tracking-[0.2em]">Focus Mode</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="text-6xl font-mono font-bold text-white tracking-tighter">
                                    {formatTime(timeElapsed)}
                                </div>
                                <div className="text-sm text-gray-500 mt-2">
                                    Restante: {formatTime(timeLeft)}
                                </div>
                                {isActive && (
                                    <div className={`text-xs mt-2 font-medium ${goalMet ? 'text-green-400' : 'text-gray-500'}`}>
                                        {percentage}% {goalMet ? '✓ Objetivo atingido' : `/ 60% mínimo`}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-sm">
                <div className="flex items-center gap-6">
                    {isActive ? (
                        <button
                            onClick={handleStop}
                            className="w-16 h-16 rounded-full bg-void-dark border border-red-500/50 text-red-500 hover:bg-red-500/10 hover:scale-105 transition-all flex items-center justify-center"
                        >
                            <Square size={24} fill="currentColor" />
                        </button>
                    ) : (
                        <button
                            onClick={start}
                            className="w-20 h-20 rounded-full bg-primary text-white shadow-glow-purple hover:scale-110 transition-all flex items-center justify-center"
                        >
                            <Play size={32} fill="currentColor" className="ml-1" />
                        </button>
                    )}
                </div>

                {/* Focus Mode Toggle */}
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={isFocusMode}
                            onChange={() => setIsFocusMode(!isFocusMode)}
                            className="sr-only"
                        />
                        <div className={`w-10 h-6 rounded-full transition-colors duration-300 ${isFocusMode ? 'bg-primary' : 'bg-gray-700'}`} />
                        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${isFocusMode ? 'translate-x-4' : ''}`} />
                    </div>
                    <span className={`text-sm font-medium transition-colors ${isFocusMode ? 'text-primary' : 'text-gray-500 group-hover:text-gray-400'}`}>
                        Modo Foco (Sem números)
                    </span>
                </label>

                {!isActive && (
                    <div className="text-center">
                        <p className="text-xs text-gray-500 max-w-[280px]">
                            Completa pelo menos 60% do tempo ({Math.floor(goalMinutes * 0.6)}min) para marcar como concluída.
                        </p>
                        <p className="text-xs text-primary mt-2">
                            O timer para automaticamente ao atingir {goalMinutes} minutos.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MeditacaoPage
