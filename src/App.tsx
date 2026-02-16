import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import TreinoPage from './pages/TreinoPage'
import LivrosPage from './pages/LivrosPage'
import MeditacaoPage from './pages/MeditacaoPage'
import PerfilPage from './pages/PerfilPage'
import JournalPage from './pages/JournalPage'
import './index.css'

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Navigate to="/treino" replace />} />
                    <Route path="/treino" element={<TreinoPage />} />
                    <Route path="/livros" element={<LivrosPage />} />
                    <Route path="/meditacao" element={<MeditacaoPage />} />
                    <Route path="/perfil" element={<PerfilPage />} />
                    <Route path="/journal" element={<JournalPage />} />
                </Routes>
            </Layout>
        </Router>
    )
}

export default App
