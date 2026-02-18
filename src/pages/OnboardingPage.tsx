import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dumbbell, Brain, Book, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

interface OnboardingData {
    trainingDays: number
    selectedDays: string[]
    meditationMinutes: number
    meditationFrequency: number // times per week
    readingPages: number
    readingFrequency: number // times per day
    rememberPhrases: string[]
}

const WEEKDAYS = [
    { id: 'seg', label: 'Seg' },
    { id: 'ter', label: 'Ter' },
    { id: 'qua', label: 'Qua' },
    { id: 'qui', label: 'Qui' },
    { id: 'sex', label: 'Sex' },
    { id: 'sab', label: 'Sáb' },
    { id: 'dom', label: 'Dom' },
]

export default function OnboardingPage() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [step, setStep] = useState(1)
    const [data, setData] = useState<OnboardingData>({
        trainingDays: 3,
        selectedDays: [],
        meditationMinutes: 10,
        meditationFrequency: 7,
        readingPages: 10,
        readingFrequency: 1,
        rememberPhrases: ['']
    })

    const handleNext = () => {
        if (step < 3) setStep(step + 1)
        else finishOnboarding()
    }

    const finishOnboarding = async () => {
        try {
            // Use user from AuthContext (works for both real and offline users)
            if (!user) throw new Error("No user found")

            // Use UPSERT (insert with ON CONFLICT) to handle both new and existing users
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    name: user.name,
                    training_days_goal: data.trainingDays,
                    meditation_goal_minutes: data.meditationMinutes,
                    reading_goal_pages: data.readingPages,
                    remember_me_phrases: data.rememberPhrases,
                })

            if (error) throw error

            navigate('/rotina')
        } catch (error) {
            console.error("Error saving onboarding:", error)
            alert("Erro ao salvar dados. Tente novamente.")
        }
    }

    const toggleDay = (dayId: string) => {
        const current = data.selectedDays.includes(dayId)
        let newDays = current
            ? data.selectedDays.filter(d => d !== dayId)
            : [...data.selectedDays, dayId]

        setData({ ...data, selectedDays: newDays, trainingDays: newDays.length })
    }

    const updatePhrase = (index: number, value: string) => {
        const newPhrases = [...data.rememberPhrases]
        newPhrases[index] = value
        setData({ ...data, rememberPhrases: newPhrases })
    }

    const addPhrase = () => {
        setData({ ...data, rememberPhrases: [...data.rememberPhrases, ''] })
    }

    return (
        <div className="min-h-screen bg-void-obsidian flex items-center justify-center p-6 font-sans">
            <div className="w-full max-w-2xl bg-void-card border border-void-border rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 h-1 bg-void-border w-full">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        {step === 1 && "Vamos configurar seus Treinos"}
                        {step === 2 && "Mente & Conhecimento"}
                        {step === 3 && "Sua Identidade"}
                    </h1>
                    <p className="text-gray-500 mt-2">
                        {step === 1 && "Defina sua frequência para criarmos uma rotina sólida."}
                        {step === 2 && "Hábitos diários para evoluir sua mente."}
                        {step === 3 && "Frases que definem quem você quer se tornar."}
                    </p>
                </div>

                {/* Step 1: Training */}
                {step === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                <Dumbbell size={40} className="text-primary" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-300 text-center">
                                Quantas vezes por semana você vai treinar?
                            </label>
                            <div className="flex justify-center gap-3">
                                {[1, 2, 3, 4, 5, 6, 7].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => setData({ ...data, trainingDays: num })}
                                        className={`
                                            w-12 h-12 rounded-xl font-bold transition-all duration-200
                                            ${data.trainingDays === num
                                                ? 'bg-primary text-white shadow-glow-purple scale-110'
                                                : 'bg-void-dark border border-void-border text-gray-500 hover:border-gray-400'
                                            }
                                        `}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-center text-gray-500 mt-2">
                                Você poderá criar {data.trainingDays} treino(s) personalizado(s)
                            </p>
                        </div>
                    </div>
                )}

                {/* Step 2: Mind & Knowledge */}
                {step === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                        {/* Meditation */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-lg font-bold text-white">
                                <Brain className="text-accent-cyan" /> Metas de Meditação
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400">Minutos por sessão</label>
                                    <input
                                        type="number"
                                        value={data.meditationMinutes}
                                        onChange={(e) => setData({ ...data, meditationMinutes: parseInt(e.target.value) })}
                                        className="input-premium w-full"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400">Vezes por semana</label>
                                    <input
                                        type="number"
                                        max={7}
                                        value={data.meditationFrequency}
                                        onChange={(e) => setData({ ...data, meditationFrequency: parseInt(e.target.value) })}
                                        className="input-premium w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-void-border/50" />

                        {/* Reading */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-lg font-bold text-white">
                                <Book className="text-accent-amber" /> Metas de Leitura
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400">Páginas por dia</label>
                                    <input
                                        type="number"
                                        value={data.readingPages}
                                        onChange={(e) => setData({ ...data, readingPages: parseInt(e.target.value) })}
                                        className="input-premium w-full"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400">Sessões por dia</label>
                                    <input
                                        type="number"
                                        value={data.readingFrequency}
                                        onChange={(e) => setData({ ...data, readingFrequency: parseInt(e.target.value) })}
                                        className="input-premium w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Identity / Remember Me */}
                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="flex justify-center mb-2">
                            <Sparkles className="text-yellow-400" size={32} />
                        </div>
                        <p className="text-center text-gray-400 text-sm">
                            Escreva frases que você quer ler todos os dias. Elas aparecerão como lembretes inegociáveis.
                        </p>

                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                            {data.rememberPhrases.map((phrase, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <span className="py-3 text-gray-600 font-mono text-xs opacity-50">{idx + 1}.</span>
                                    <input
                                        type="text"
                                        value={phrase}
                                        onChange={(e) => updatePhrase(idx, e.target.value)}
                                        placeholder="Ex: Eu sou disciplinado..."
                                        className="flex-1 bg-void-dark border-b border-void-border focus:border-primary px-3 py-2 text-white outline-none transition-colors placeholder-gray-700"
                                        autoFocus={idx === data.rememberPhrases.length - 1}
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={addPhrase}
                            className="text-xs text-primary hover:text-primary-glow font-medium flex items-center gap-1 mx-auto"
                        >
                            + Adicionar outra frase
                        </button>
                    </div>
                )}

                {/* Footer Controls */}
                <div className="mt-12 flex justify-between items-center pt-6 border-t border-void-border/50">
                    <div className="flex gap-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`h-2 w-2 rounded-full transition-colors ${step === i ? 'bg-primary' : 'bg-void-border'}`} />
                        ))}
                    </div>

                    <button
                        onClick={handleNext}
                        className="btn-primary flex items-center gap-2 px-8 py-3"
                    >
                        {step === 3 ? 'Finalizar & Começar' : 'Próximo'}
                        {step === 3 ? <CheckCircle2 size={18} /> : <ArrowRight size={18} />}
                    </button>
                </div>
            </div>
        </div>
    )
}
