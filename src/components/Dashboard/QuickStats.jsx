import { Timer, Target, BookOpen } from 'lucide-react'

function QuickStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="card text-center group hover:border-primary/50 transition-colors">
                <div className="flex justify-center mb-2 text-primary group-hover:scale-110 transition-transform">
                    <Timer size={40} />
                </div>
                <div className="text-2xl font-bold text-green-premium">3h 42min</div>
                <div className="text-sm text-gray-400 mt-1">Tempo produtivo hoje</div>
            </div>

            <div className="card text-center group hover:border-primary/50 transition-colors">
                <div className="flex justify-center mb-2 text-primary group-hover:scale-110 transition-transform">
                    <Target size={40} />
                </div>
                <div className="text-2xl font-bold text-green-premium">4</div>
                <div className="text-sm text-gray-400 mt-1">Goals ativos</div>
            </div>

            <div className="card text-center group hover:border-primary/50 transition-colors">
                <div className="flex justify-center mb-2 text-primary group-hover:scale-110 transition-transform">
                    <BookOpen size={40} />
                </div>
                <div className="text-2xl font-bold text-green-premium">2</div>
                <div className="text-sm text-gray-400 mt-1">Livros a ler</div>
            </div>
        </div>
    )
}

export default QuickStats
