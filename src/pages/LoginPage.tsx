import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { Lock, AtSign, AlertCircle } from 'lucide-react'

export default function LoginPage() {
    const [handle, setHandle] = useState('')
    const [pin, setPin] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const { success, error: authError } = await login(handle, pin)

        setLoading(false)
        if (!success) {
            setError(authError || '@ ou PIN incorretos.')
        }
    }

    return (
        <div className="min-h-screen bg-void-obsidian flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-void-card border border-void-border rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-premium mb-2">Bem-vindo de volta</h1>
                    <p className="text-gray-400">Entra com o teu @ e PIN.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Handle */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">O teu @</label>
                        <div className="relative">
                            <AtSign className="absolute left-4 top-3.5 text-gray-500" size={20} />
                            <input
                                type="text"
                                value={handle}
                                onChange={e => setHandle(e.target.value.replace(/^@/, '').toLowerCase())}
                                className="w-full bg-void-dark border border-void-border rounded-xl pl-12 pr-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                                placeholder="pedro"
                                autoComplete="username"
                                required
                            />
                        </div>
                    </div>

                    {/* PIN */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">PIN de Acesso</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 text-gray-500" size={20} />
                            <input
                                type="password"
                                value={pin}
                                onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
                                className="w-full bg-void-dark border border-void-border rounded-xl pl-12 pr-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all tracking-widest text-lg"
                                placeholder="••••"
                                maxLength={6}
                                inputMode="numeric"
                                autoComplete="current-password"
                                required
                            />
                        </div>
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
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'A entrar...' : 'Entrar'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-500">
                        Não tens conta?{' '}
                        <Link to="/signup" className="text-primary hover:text-primary-glow font-medium transition-colors">
                            Criar agora
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
