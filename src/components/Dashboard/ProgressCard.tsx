interface ProgressCardProps {
    completedCount: number
    totalCount: number
}

function ProgressCard({ completedCount, totalCount }: ProgressCardProps) {
    const progressPercentage = totalCount === 0 ? 0 : (completedCount / totalCount) * 100

    return (
        <div className="card mb-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">Progresso Hoje</h3>
                <span className="text-green-premium font-bold text-lg">
                    {completedCount}/{totalCount} completo
                </span>
            </div>
            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
        </div>
    )
}

export default ProgressCard
