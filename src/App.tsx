import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout/Layout'
import TreinoPage from './pages/TreinoPage'
import LivrosPage from './pages/LivrosPage'
import MeditacaoPage from './pages/MeditacaoPage'
import PerfilPage from './pages/PerfilPage'
import JournalPage from './pages/JournalPage'
import RotinaPage from './pages/RotinaPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import './index.css'

import OnboardingPage from './pages/OnboardingPage'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth()
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />

                    {/* Protected Routes - Onboarding is special (no Layout) */}
                    <Route path="/onboarding" element={
                        <ProtectedRoute>
                            <OnboardingPage />
                        </ProtectedRoute>
                    } />

                    {/* Protected Routes - Wrapped in Layout */}
                    <Route path="/" element={<Navigate to="/treino" replace />} />

                    <Route path="/treino" element={
                        <ProtectedRoute>
                            <Layout>
                                <TreinoPage />
                            </Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/livros" element={
                        <ProtectedRoute>
                            <Layout>
                                <LivrosPage />
                            </Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/meditacao" element={
                        <ProtectedRoute>
                            <Layout>
                                <MeditacaoPage />
                            </Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/rotina" element={
                        <ProtectedRoute>
                            <Layout>
                                <RotinaPage />
                            </Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/perfil" element={
                        <ProtectedRoute>
                            <Layout>
                                <PerfilPage />
                            </Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/journal" element={
                        <ProtectedRoute>
                            <Layout>
                                <JournalPage />
                            </Layout>
                        </ProtectedRoute>
                    } />
                </Routes>
            </AuthProvider>
        </Router>
    )
}

export default App
