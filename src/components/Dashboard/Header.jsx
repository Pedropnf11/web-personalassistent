import { Flame, Shield } from 'lucide-react'

function Header({ streak, totalStreak }) {
    return (
        <header className="bg-cave-dark border-b border-cave-light px-8 py-6">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-green-neon">Personal Mentor</h1>
                    <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">Tua discipline cave <Shield size={14} /></p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <div className="text-sm text-gray-400">Streak Atual</div>
                        <div className="text-4xl font-bold bg-gradient-to-r from-green-neon to-green-premium bg-clip-text text-transparent flex items-center gap-2">
                            <Flame className="text-orange-500" fill="orange" /> {streak}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-400">Total</div>
                        <div className="text-2xl font-semibold text-green-premium">
                            {totalStreak} dias
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
