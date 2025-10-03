import { useState, useEffect } from 'react'
import { cosmic, hasStatus } from '../lib/cosmic'
import { News } from '../types'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import { format } from 'date-fns'

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

    const getCategoryColor = (category?: string) => {
        switch (category) {
            case 'event':
                return 'bg-secondary text-white'
            case 'maintenance':
                return 'bg-yellow-500 text-dark'
            case 'community':
                return 'bg-accent text-white'
            default:
                return 'bg-primary text-white'
        }
    }

    const getPriorityBadge = (priority?: string) => {
        if (priority === 'critical') {
            return (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500 text-white">
                    Critical
                </span>
            )
        }
        if (priority === 'important') {
            return (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500 text-dark">
                    Important
                </span>
            )
        }
        return null
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

            {/* News Carousel */}
            <div className="relative">
                <div className="card overflow-hidden">
                    <div className="relative h-96 md:h-[500px]">
                        {currentNews.metadata?.featured_image && (
                            <img
                                src={`${currentNews.metadata.featured_image.imgix_url}?w=1200&h=600&fit=crop&auto=format,compress`}
                                alt={currentNews.title}
                                className="absolute inset-0 w-full h-full object-cover opacity-30"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent"></div>
                        <div className="absolute inset-0 flex flex-col justify-end p-8">
                            <div className="flex items-center gap-3 mb-4">
                                {currentNews.metadata?.category && (
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(currentNews.metadata.category.key)}`}>
                                        {currentNews.metadata.category.value}
                                    </span>
                                )}
                                {currentNews.metadata?.priority && getPriorityBadge(currentNews.metadata.priority.key)}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">{currentNews.title}</h2>
                            {currentNews.metadata?.publication_date && (
                                <p className="text-gray-400 mb-4">
                                    {format(new Date(currentNews.metadata.publication_date), 'MMMM dd, yyyy')}
                                    {currentNews.metadata?.author && ` • By ${currentNews.metadata.author}`}
                                </p>
                            )}
                            <div
                                className="text-gray-300 line-clamp-3"
                                dangerouslySetInnerHTML={{ __html: currentNews.metadata?.content || '' }}
                            />
                            {currentNews.metadata?.related_link && (
                                <a
                                    href={currentNews.metadata.related_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-block btn btn-primary"
                                >
                                    Read More
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Carousel Navigation */}
                {news.length > 1 && (
                    <div className="flex justify-center mt-4 space-x-2">
                        {news.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentSlide ? 'bg-primary w-8' : 'bg-gray-600'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

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