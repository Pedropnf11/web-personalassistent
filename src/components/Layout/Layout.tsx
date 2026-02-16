import { useState, ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Dumbbell, Book, Brain, NotebookPen, User, Menu } from 'lucide-react'

interface LayoutProps {
    children: ReactNode
}

function Layout({ children }: LayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const location = useLocation()

    const isActive = (path: string) => location.pathname.startsWith(path)

    const navItems = [
        { name: 'Treino', path: '/treino', icon: <Dumbbell size={24} /> },
        { name: 'Bilblioteca', path: '/livros', icon: <Book size={24} /> },
        { name: 'Meditação', path: '/meditacao', icon: <Brain size={24} /> },
        { name: 'Journaling', path: '/journal', icon: <NotebookPen size={24} /> },
    ]

    return (
        <div className="flex h-screen bg-void-obsidian overflow-hidden font-sans">
            {/* Sidebar Desktop */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-void-dark border-r border-void-border/50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                <div className="flex flex-col h-full relative overflow-hidden">
                    {/* Background Glow Effect */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary-dark/5 to-transparent pointer-events-none" />

                    {/* Logo */}
                    <div className="p-8 pb-4 relative z-10">
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-premium tracking-tight">
                            Personal Mentor
                        </h1>
                        <p className="text-xs text-slate-500 mt-2 font-medium tracking-wide uppercase">
                            Premium Edition
                        </p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-8 space-y-3 relative z-10">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                  flex items-center gap-4 px-5 py-4 rounded-xl
                  transition-all duration-300 group relative overflow-hidden
                  ${isActive(item.path)
                                        ? 'text-white shadow-glow-purple'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }
                `}
                            >
                                {/* Active Background Gradient */}
                                {isActive(item.path) && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/80 to-primary/80 opacity-100" />
                                )}

                                <span className={`text-2xl relative z-10 transition-transform duration-300 ${isActive(item.path) ? 'scale-110' : 'group-hover:scale-110'}`}>
                                    {item.icon}
                                </span>
                                <span className="relative z-10 font-medium text-lg">{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Perfil at bottom */}
                    <div className="p-4 border-t border-void-border/50 relative z-10">
                        <Link
                            to="/perfil"
                            onClick={() => setSidebarOpen(false)}
                            className={`
                flex items-center gap-4 px-4 py-3 rounded-xl
                transition-all duration-300 border border-transparent
                ${isActive('/perfil')
                                    ? 'bg-void-card border-primary/30 shadow-glow-purple'
                                    : 'hover:bg-void-card hover:border-void-border'
                                }
              `}
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-premium p-[1px]">
                                <div className="w-full h-full rounded-full bg-void-dark flex items-center justify-center">
                                    <User size={20} className="text-white" />
                                </div>
                            </div>
                            <div>
                                <div className="font-bold text-white">Pedro</div>
                                <div className="text-xs text-primary-glow">High Performer</div>
                            </div>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Mobile Header with Hamburger */}
                <header className="lg:hidden bg-void-dark/80 backdrop-blur-md border-b border-void-border/50 px-6 py-4 flex items-center justify-between z-30 sticky top-0">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-white text-2xl"
                    >
                        <span className="sr-only">Menu</span>
                        <Menu size={24} />
                    </button>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-premium">
                        Personal Mentor
                    </span>
                    <div className="w-8"></div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-void-obsidian scrollbar-thin scrollbar-thumb-void-border scrollbar-track-transparent">
                    {/* Background decoration */}
                    <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary-dark/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
                    <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-accent-cyan/5 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/2" />

                    {children}
                </main>
            </div>
        </div>
    )
}

export default Layout
