import { useState, useEffect } from 'react'
import { cosmic, hasStatus } from '../lib/cosmic'
import { News } from '../types'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import NewsCarousel from "../components/Carrusel"
import { getCategoryColor,getPriorityBadge } from '@/utils/newHrlpers'


export default function Home() {
    const [news, setNews] = useState<News[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        fetchNews()
    }, [])

    useEffect(() => {
        if (news.length > 0) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % news.length)
            }, 5000)
            return () => clearInterval(timer)
        }
    }, [news.length])

    async function fetchNews() {
        try {
            const response = await cosmic.objects
                .find({ type: 'news' })
                .props(['id', 'title', 'slug', 'metadata'])
                .depth(1)

            const sortedNews = (response.objects as News[]).sort((a, b) => {
                const dateA = new Date(a.metadata?.publication_date || '').getTime()
                const dateB = new Date(b.metadata?.publication_date || '').getTime()
                return dateB - dateA
            })

            setNews(sortedNews)
        } catch (err) {
            if (hasStatus(err) && err.status === 404) {
                setNews([])
            } else {
                setError('Failed to load news')
            }
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <Loading />
    if (error) return <ErrorMessage message={error} />

    const currentNews = news[currentSlide]
    if (!currentNews) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-400">No news available</p>
            </div>
        )
    }


    return (
        <div className="space-y-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                    Welcome to the Arena
                </h1>
                <p className="text-gray-400 text-lg">
                    Latest news, updates, and community highlights
                </p>
            </div>

          <h1 className="text-4xl font-bold mb-8">Últimas Noticias</h1>

        {/* 🔹 Invocás tu carrusel con props */}
        {news.length > 0 && (
          <NewsCarousel
            news={news}
            
          />
        )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card text-center">
                    <div className="text-4xl font-bold gradient-text mb-2">3</div>
                    <div className="text-gray-400">Playable Characters</div>
                </div>
                <div className="card text-center">
                    <div className="text-4xl font-bold gradient-text mb-2">2</div>
                    <div className="text-gray-400">Active Tournaments</div>
                </div>
                <div className="card text-center">
                    <div className="text-4xl font-bold gradient-text mb-2">2</div>
                    <div className="text-gray-400">Available Maps</div>
                </div>
            </div>
        </div>
    )
}