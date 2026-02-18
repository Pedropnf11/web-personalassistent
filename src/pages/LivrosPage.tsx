import { useState } from 'react'
import { Plus, X, BookOpen, Trash2 } from 'lucide-react'
import { useLivros, BookFormData, COLOR_GRADIENTS, STATUS_LABELS, DEFAULT_BOOK_FORM } from '../hooks/useLivros'
import type { Book } from '../hooks/useLivros'

function LivrosPage() {
    const { books, completedCount, addBook, updateBook, deleteBook, getInitials } = useLivros()

    const [selectedBook, setSelectedBook] = useState<Book | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isAddMode, setIsAddMode] = useState(false)
    const [formData, setFormData] = useState<BookFormData>(DEFAULT_BOOK_FORM)

    const openAddModal = () => {
        setFormData({
            ...DEFAULT_BOOK_FORM,
            color_gradient: COLOR_GRADIENTS[Math.floor(Math.random() * COLOR_GRADIENTS.length)]
        })
        setSelectedBook(null)
        setIsAddMode(true)
        setIsModalOpen(true)
    }

    const openEditModal = (book: Book) => {
        setFormData({
            title: book.title,
            author: book.author,
            status: book.status,
            start_date: book.start_date || '',
            finish_date: book.finish_date || '',
            color_gradient: book.color_gradient
        })
        setSelectedBook(book)
        setIsAddMode(false)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedBook(null)
        setIsAddMode(false)
    }

    const handleSave = async () => {
        if (!formData.title || !formData.author) {
            alert('Preencha título e autor')
            return
        }
        const ok = isAddMode
            ? await addBook(formData)
            : selectedBook ? await updateBook(selectedBook.id, formData) : false

        if (ok) closeModal()
    }

    const handleDelete = async (bookId: string) => {
        if (!confirm('Remover este livro?')) return
        const ok = await deleteBook(bookId)
        if (ok) closeModal()
    }

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-premium mb-2">
                        <BookOpen className="inline mb-1 mr-2" size={32} />
                        Biblioteca
                    </h1>
                    <p className="text-gray-400">
                        {books.length} livros na coleção · <span className="text-primary">{completedCount} lidos</span>
                    </p>
                </div>
                <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
                    <Plus size={20} /> Adicionar Livro
                </button>
            </div>

            {books.length === 0 ? (
                <div className="text-center py-20">
                    <BookOpen size={64} className="mx-auto text-gray-700 mb-4" />
                    <p className="text-xl text-gray-500">Nenhum livro adicionado ainda</p>
                    <p className="text-gray-600 mt-2">Clique em "Adicionar Livro" para começar</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {books.map((book) => (
                        <div key={book.id} onClick={() => openEditModal(book)} className="group cursor-pointer perspective-1000">
                            <div className={`
                                relative aspect-[2/3] rounded-sm rounded-r-lg shadow-2xl 
                                transition-all duration-500 transform group-hover:-translate-y-2 group-hover:rotate-y-[-10deg] group-hover:shadow-glow-purple
                                bg-gradient-to-br ${book.color_gradient} p-1
                            `}>
                                <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none" />
                                <div className="absolute left-0 top-0 bottom-0 w-2 bg-white/20 blur-[1px] rounded-l-sm" />
                                <div className="flex flex-col items-center justify-center h-full text-center p-4 border border-white/10 rounded-r-md">
                                    <span className="text-5xl font-black text-white/90 drop-shadow-md tracking-tighter">
                                        {getInitials(book.title)}
                                    </span>
                                    {book.status === 'completed' && (
                                        <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4 text-center">
                                <h3 className="font-bold text-white leading-tight group-hover:text-primary-glow transition-colors line-clamp-2">{book.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">{book.author}</p>
                                <p className="text-xs text-gray-600 mt-1">{STATUS_LABELS[book.status]}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative bg-void-card border border-void-border rounded-2xl p-8 max-w-md w-full shadow-2xl animate-float">
                        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                            <X size={20} />
                        </button>

                        <div className={`h-32 w-full rounded-t-xl bg-gradient-to-r ${formData.color_gradient} mb-6 -mt-8 -mx-8 w-[calc(100%+4rem)] flex items-center justify-center`}>
                            <span className="text-6xl font-bold text-white/50">
                                {formData.title ? getInitials(formData.title) : '?'}
                            </span>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-6">
                            {isAddMode ? 'Adicionar Livro' : 'Editar Livro'}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Título</label>
                                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input-premium w-full" placeholder="Nome do livro" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Autor</label>
                                <input type="text" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} className="input-premium w-full" placeholder="Nome do autor" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as Book['status'] })} className="input-premium w-full bg-void-dark text-white">
                                    <option value="wishlist">Wishlist</option>
                                    <option value="reading">Lendo</option>
                                    <option value="completed">Concluído</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Início</label>
                                    <input type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} className="input-premium w-full" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Fim</label>
                                    <input type="date" value={formData.finish_date} onChange={(e) => setFormData({ ...formData, finish_date: e.target.value })} className="input-premium w-full" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Cor</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {COLOR_GRADIENTS.map((gradient) => (
                                        <button
                                            key={gradient}
                                            onClick={() => setFormData({ ...formData, color_gradient: gradient })}
                                            className={`h-12 rounded-lg bg-gradient-to-r ${gradient} transition-all ${formData.color_gradient === gradient ? 'ring-2 ring-primary ring-offset-2 ring-offset-void-dark scale-110' : 'hover:scale-105'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-between gap-3">
                            {!isAddMode && selectedBook && (
                                <button onClick={() => handleDelete(selectedBook.id)} className="text-red-500 hover:text-red-400 flex items-center gap-2">
                                    <Trash2 size={18} /> Remover
                                </button>
                            )}
                            <div className="flex gap-3 ml-auto">
                                <button onClick={closeModal} className="btn-ghost">Cancelar</button>
                                <button onClick={handleSave} className="btn-primary">Salvar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LivrosPage
