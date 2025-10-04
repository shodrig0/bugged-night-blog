"use client"
import { useState, useEffect, useCallback } from "react"
import { cosmic, hasStatus } from "../lib/cosmic"
import { News } from "../types"
import Loading from "../components/Loading"
import ErrorMessage from "../components/ErrorMessage"
import NewsCarousel from "../components/Carrusel"

export default function Home() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNews = useCallback(async () => {
    try {
      const response = await cosmic.objects
        .find({ type: "news" })
        .props(["id", "title", "slug", "metadata"])
        .depth(1)
        .limit(5)

      const sortedNews = (response.objects as News[]).sort((a, b) => {
        const dateA = new Date(a.metadata?.publication_date || "").getTime()
        const dateB = new Date(b.metadata?.publication_date || "").getTime()
        return dateB - dateA
      })

      setNews(sortedNews)
    } catch (err) {
      if (hasStatus(err) && err.status === 404) {
        setNews([])
      } else {
        setError("Error al cargar noticias")
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNews()
  }, [fetchNews])

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
          Bienvenidos
        </h1>
        <p className="text-gray-400 text-lg">
          Todo el desarrollo de Bugged Night será publicado acá
        </p>
      </div>

      <h1 className="text-4xl font-bold mb-8">Últimas Noticias</h1>

      {news.length > 0 ? (
        <NewsCarousel news={news} />
      ) : (
        <p className="text-gray-400 text-center">Sin noticias todavía</p>
      )}
    </div>
  )
}


