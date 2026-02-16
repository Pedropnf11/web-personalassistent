import { useState, useEffect } from 'react'

function MeditacaoPage() {
    const [duration, setDuration] = useState(10) // minutes
    const [timeLeft, setTimeLeft] = useState(duration * 60)
    const [isActive, setIsActive] = useState(false)
    const [sessionType, setSessionType] = useState('Silent Focus')

    useEffect(() => {
        let interval
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(t => t - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            setIsActive(false)
        }
        return () => clearInterval(interval)
    }, [isActive, timeLeft])

    const toggleTimer = () => {
        setIsActive(!isActive)
    }

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60)
        const sec = seconds % 60
        return `${min}:${sec < 10 ? '0' : ''}${sec}`
    }

    const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100

    return (
        <div className="h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
            {/* Background Ambient Glow */}
            <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${isActive ? 'opacity-30' : 'opacity-10'}`}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-dark rounded-full blur-[150px] animate-pulse-slow" />
            </div>

            <div className="z-10 text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Meditation Space</h1>
                <p className="text-gray-400">Disconnect to Reconnect</p>
            </div>

            <div className="relative z-10 group cursor-pointer" onClick={toggleTimer}>
                {/* Animated Glow Rings */}
                {isActive && (
                    <>
                        <div className="absolute inset-0 rounded-full border border-primary-glow/30 animate-[ping_3s_ease-in-out_infinite]" />
                        <div className="absolute inset-[-20px] rounded-full border border-primary-glow/20 animate-[ping_4s_ease-in-out_infinite_0.5s]" />
                    </>
                )}

                {/* Main Circle */}
                <div className={`
             w-80 h-80 rounded-full flex flex-col items-center justify-center
             bg-void-card/80 backdrop-blur-md border border-white/10 shadow-2xl
             transition-all duration-500 relative overflow-hidden
             ${isActive ? 'shadow-glow-strong scale-105 border-primary-glow/50' : 'hover:border-white/20 hover:scale-105'}
        `}>
                    {/* Progress Fill (Conic Gradient simulation or Clip Path) */}
                    <div
                        className="absolute inset-0 bg-primary-dark/20 transition-all duration-1000 ease-linear origin-bottom"
                        style={{ height: `${progress}%` }}
                    />

                    <div className="relative z-20 text-center">
                        {!isActive && timeLeft === duration * 60 ? (
                            <span className="text-4xl font-bold text-white tracking-widest uppercase animate-pulse">
                                Start
                            </span>
                        ) : (
                            <>
                                <div className="text-6xl font-mono font-bold text-white tabular-nums tracking-tighter">
                                    {formatTime(timeLeft)}
                                </div>
                                <div className="text-sm text-primary-glow mt-2 font-medium uppercase tracking-widest">
                                    {isActive ? 'Focusing...' : 'Paused'}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Duration Selector */}
            <div className="relative z-10 mt-16 flex gap-4">
                {[5, 10, 20, 30].map(min => (
                    <button
                        key={min}
                        onClick={() => {
                            setDuration(min)
                            setTimeLeft(min * 60)
                            setIsActive(false)
                        }}
                        className={`
                    px-6 py-2 rounded-full border transition-all duration-300
                    ${duration === min
                                ? 'bg-primary/20 border-primary text-white shadow-glow-purple'
                                : 'bg-transparent border-white/10 text-gray-500 hover:border-white/30 hover:text-white'}
                `}
                    >
                        {min}m
                    </button>
                ))}
            </div>
        </div>
    )
}

export default MeditacaoPage
