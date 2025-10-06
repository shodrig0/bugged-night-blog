// src/components/Comments.jsx

import { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import { getComments, createComment } from '../lib/cosmic'
import { Comment } from '../types'

interface FormData {
    name: string
    email: string
    comment: string
}

export default function Comments() {
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        comment: ''
    })
    const [submitting, setSubmitting] = useState<boolean>(false)

    useEffect(() => {
        loadComments()
    }, [])

    async function loadComments() {
        try {
            const data = await getComments();
            setComments(data as unknown as Comment[])
        } catch (error) {
            console.error('Error cargando comentarios:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setSubmitting(true)

        try {
            await createComment(
                formData.name,
                formData.email,
                formData.comment
            )

            setFormData({ name: '', email: '', comment: '' })
            await loadComments()

            alert('Comentario enviado con éxito')
        } catch (error) {
            console.error('Error submitting comment:', error)
            alert('Error')
        } finally {
            setSubmitting(false)
        }
    }

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-gray-900 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                    Agrega un nuevo comentario
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2">Tu nombre</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Esteban"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-cyan-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2">Tu email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="ejemplo@hotmail.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-cyan-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-300 mb-2">Comentario</label>
                        <textarea
                            name="comment"
                            placeholder="Increíble..."
                            value={formData.comment}
                            onChange={handleChange}
                            required
                            rows={5}
                            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-cyan-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
                    >
                        {submitting ? 'Enviando...' : 'Enviar'}
                    </button>
                </form>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-4">Comentarios</h3>

                {loading ? (
                    <p className="text-gray-400">Cargando comentarios...</p>
                ) : comments.length === 0 ? (
                    <p className="text-gray-400">No hay comentarios todavía, sé el primero</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-900 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold text-white">
                                    {comment.title}
                                </span>
                                <span className="text-gray-500 text-sm">
                                    {comment.metadata?.email}
                                </span>
                            </div>
                            <p className="text-gray-300">{comment.metadata?.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}