import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export interface Book {
    id: string
    user_id: string
    title: string
    author: string
    status: 'wishlist' | 'reading' | 'completed'
    start_date?: string
    finish_date?: string
    color_gradient: string
    created_at: string
}

export type BookStatus = Book['status']

export interface BookFormData {
    title: string
    author: string
    status: BookStatus
    start_date: string
    finish_date: string
    color_gradient: string
}

export const COLOR_GRADIENTS = [
    'from-purple-500 to-indigo-500',
    'from-emerald-500 to-teal-500',
    'from-blue-500 to-cyan-500',
    'from-orange-500 to-amber-500',
    'from-pink-500 to-rose-500',
    'from-red-500 to-orange-500',
    'from-yellow-500 to-lime-500',
    'from-green-500 to-emerald-500',
]

export const STATUS_LABELS: Record<BookStatus, string> = {
    wishlist: 'Wishlist',
    reading: 'Lendo',
    completed: 'Concluído'
}

export const DEFAULT_BOOK_FORM: BookFormData = {
    title: '',
    author: '',
    status: 'wishlist',
    start_date: '',
    finish_date: '',
    color_gradient: COLOR_GRADIENTS[0]
}

export function useLivros() {
    const { user } = useAuth()
    const [books, setBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user) fetchBooks()
    }, [user])

    const fetchBooks = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('books')
            .select('*')
            .eq('user_id', user!.id)
            .order('created_at', { ascending: false })

        if (!error && data) setBooks(data)
        setLoading(false)
    }

    const addBook = async (formData: BookFormData): Promise<boolean> => {
        if (!formData.title || !formData.author) return false

        const { error } = await supabase.from('books').insert({
            user_id: user!.id,
            title: formData.title,
            author: formData.author,
            status: formData.status,
            start_date: formData.start_date || null,
            finish_date: formData.finish_date || null,
            color_gradient: formData.color_gradient
        })

        if (error) return false
        await fetchBooks()
        return true
    }

    const updateBook = async (bookId: string, formData: BookFormData): Promise<boolean> => {
        const { error } = await supabase
            .from('books')
            .update({
                title: formData.title,
                author: formData.author,
                status: formData.status,
                start_date: formData.start_date || null,
                finish_date: formData.finish_date || null,
                color_gradient: formData.color_gradient
            })
            .eq('id', bookId)

        if (error) return false
        await fetchBooks()
        return true
    }

    const deleteBook = async (bookId: string): Promise<boolean> => {
        const { error } = await supabase.from('books').delete().eq('id', bookId)
        if (error) return false
        await fetchBooks()
        return true
    }

    const getInitials = (title: string) =>
        title.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()

    const completedCount = books.filter(b => b.status === 'completed').length

    return {
        books,
        loading,
        completedCount,
        addBook,
        updateBook,
        deleteBook,
        getInitials,
        refetch: fetchBooks
    }
}
