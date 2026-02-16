import { useState } from 'react'
import { Plus, X } from 'lucide-react'

const initialBooks = [
    { id: 1, title: 'Deep Work', author: 'Cal Newport', status: 'Reading', startDate: '2026-02-01', finishDate: '', color: 'from-purple-500 to-indigo-500' },
    { id: 2, title: 'Atomic Habits', author: 'James Clear', status: 'Reading', startDate: '2026-01-20', finishDate: '', color: 'from-emerald-500 to-teal-500' },
    { id: 3, title: 'The Lean Startup', author: 'Eric Ries', status: 'Completed', startDate: '2025-12-10', finishDate: '2026-01-15', color: 'from-blue-500 to-cyan-500' },
    { id: 4, title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', status: 'To Read', startDate: '', finishDate: '', color: 'from-orange-500 to-amber-500' },
    { id: 5, title: 'Psychology of Money', author: 'Morgan Housel', status: 'To Read', startDate: '', finishDate: '', color: 'from-pink-500 to-rose-500' },
]

function LivrosPage() {
    const [books, setBooks] = useState(initialBooks)
    const [selectedBook, setSelectedBook] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const getInitials = (title) => {
        return title
            .split(' ')
            .map(word => word[0])
            .join('')
            .substring(0, 2)
            .toUpperCase()
    }

    const openBookDetails = (book) => {
        setSelectedBook(book)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedBook(null)
    }

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Biblioteca</h1>
                    <p className="text-gray-400">Knowledge Base</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Plus size={20} /> Adicionar Livro
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                {books.map((book) => (
                    <div
                        key={book.id}
                        onClick={() => openBookDetails(book)}
                        className="group cursor-pointer perspective-1000"
                    >
                        {/* Book Spine/Cover Representation */}
                        <div className={`
              relative aspect-[2/3] rounded-sm rounded-r-lg shadow-2xl 
              transition-all duration-500 transform group-hover:-translate-y-2 group-hover:rotate-y-[-10deg] group-hover:shadow-glow-purple
              bg-gradient-to-br ${book.color} p-1
            `}>
                            {/* Texture Overlay */}
                            <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none" />
                            <div className="absolute left-0 top-0 bottom-0 w-2 bg-white/20 blur-[1px] rounded-l-sm" /> {/* Book Spine detail */}

                            <div className="flex flex-col items-center justify-center h-full text-center p-4 border border-white/10 rounded-r-md">
                                <span className="text-5xl font-black text-white/90 drop-shadow-md tracking-tighter">
                                    {getInitials(book.title)}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 text-center">
                            <h3 className="font-bold text-white leading-tight group-hover:text-primary-glow transition-colors">
                                {book.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">{book.author}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Book Details Modal */}
            {isModalOpen && selectedBook && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={closeModal} />

                    <div className="relative bg-void-card border border-void-border rounded-2xl p-8 max-w-md w-full shadow-2xl animate-float">
                        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20} /></button>

                        <div className={`h-32 w-full rounded-t-xl bg-gradient-to-r ${selectedBook.color} mb-6 -mt-8 -mx-8 w-[calc(100%+4rem)] flex items-center justify-center`}>
                            <span className="text-6xl font-bold text-white/50">{getInitials(selectedBook.title)}</span>
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-1">{selectedBook.title}</h2>
                        <p className="text-xl text-gray-400 mb-6">{selectedBook.author}</p>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">Status</label>
                                <div className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white">
                                    {selectedBook.status}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">Início</label>
                                    <input
                                        type="date"
                                        className="input-premium w-full"
                                        defaultValue={selectedBook.startDate}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">Fim</label>
                                    <input
                                        type="date"
                                        className="input-premium w-full"
                                        defaultValue={selectedBook.finishDate}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <button onClick={closeModal} className="btn-ghost">Cancelar</button>
                            <button className="btn-primary">Salvar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LivrosPage
