import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { Lock, AtSign, User, CheckCircle2, AlertCircle } from 'lucide-react'

export default function SignUpPage() {
    const [name, setName] = useState('')
    const [handle, setHandle] = useState('')
    const [pin, setPin] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { signup } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (pin.length < 6) {
            setError('O PIN deve ter 6 dígitos.')
            return
        }

        const cleanHandle = handle.replace(/^@/, '').trim()
        if (!cleanHandle) {
            setError('Escolhe um @ para a tua conta.')
            return
        }
        if (!/^[a-zA-Z0-9_]+$/.test(cleanHandle)) {
            setError('O @ só pode ter letras, números e _')
            return
        }

        setLoading(true)
        const { success, error: authError } = await signup(name, cleanHandle, pin)
        setLoading(false)

        if (!success) {
            setError(authError || 'Erro ao criar conta.')
        }
    }

    return (
        <div className="min-h-screen bg-void-obsidian flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-void-card border border-void-border rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-premium mb-2">Criar Conta</h1>
                    <p className="text-gray-400">Configura o teu acesso pessoal.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Como preferes ser chamado?</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 text-gray-500" size={20} />
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-void-dark border border-void-border rounded-xl pl-12 pr-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                placeholder="O teu nome"
                                required
                            />
                        </div>
                    </div>

                    {/* Handle */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Escolhe o teu @</label>
                        <div className="relative">
                            <AtSign className="absolute left-4 top-3.5 text-gray-500" size={20} />
                            <input
                                type="text"
                                value={handle}
                                onChange={e => setHandle(e.target.value.replace(/^@/, '').toLowerCase())}
                                className="w-full bg-void-dark border border-void-border rounded-xl pl-12 pr-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                placeholder="pedro"
                                required
                            />
                        </div>
                        {handle && (
                            <p className="text-xs text-gray-500 pl-1">
                                O teu identificador será <span className="text-primary font-medium">@{handle.replace(/^@/, '')}</span>
                            </p>
                        )}
                    </div>

                    {/* PIN */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Cria um PIN (6 dígitos)</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 text-gray-500" size={20} />
                            <input
                                type="password"
                                value={pin}
                                onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
                                className="w-full bg-void-dark border border-void-border rounded-xl pl-12 pr-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all tracking-widest text-lg"
                                placeholder="••••••"
                                maxLength={6}
                                minLength={6}
                                inputMode="numeric"
                                required
                            />
                        </div>
                        <p className="text-xs text-gray-500 pl-1">Usa este PIN de 6 dígitos para entrar na app.</p>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 py-3 px-4 rounded-lg border border-red-500/20">
                            <AlertCircle size={16} className="shrink-0" />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="flex items-center justify-center gap-2">
                            {loading ? 'A criar conta...' : (
                                <>Criar Conta <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" /></>
                            )}
                        </span>
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-500">
                        Já tens conta?{' '}
                        <Link to="/login" className="text-primary hover:text-primary-glow font-medium transition-colors">
                            Entrar
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
