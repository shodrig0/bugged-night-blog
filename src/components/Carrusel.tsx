"use client"
import React from "react"
import Slider from "react-slick"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { getCategoryColor, getPriorityBadge } from "../utils/newHelpers"

interface NewsItem {
  id: string
  title: string
  metadata: {
    featured_image?: { imgix_url: string }
    category?: { key: string; value: string }
    priority?: { key: string; value: string }
    author?: string
    publication_date?: string
    content?: string
    related_link?: string
  }
}

interface NewsCarouselProps {
  news: NewsItem[]
}

const NewsCarousel: React.FC<NewsCarouselProps> = ({ news }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    arrows: false,
    appendDots: (dots: React.ReactNode) => (
        <div className="flex justify-center mt-4 space-x-6">
        {dots}
      </div>
    ),
    customPaging: () => (
      <button
        className="w-2 h-2 rounded-full bg-gray-600 transition-all"
        aria-label="dot"
      />
    ),
  }

  return (
    <motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
    <div className="relative">
      <Slider {...settings}>
        {news.map((item) => (
          <div key={item.id} className="card overflow-hidden">
            <div className="relative h-96 md:h-[500px]">
              {/* Imagen */}
              {item.metadata?.featured_image && (
                <img
                  src={`${item.metadata.featured_image.imgix_url}?w=1200&h=600&fit=crop&auto=format,compress`}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover "
                />
              )}

             

         
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                {/* Categoría + prioridad */}
                <div className="flex items-center gap-3 mb-4">
                  {item.metadata?.category && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
                        item.metadata.category.key
                      )}`}
                    >
                      {item.metadata.category.value}
                    </span>
                  )}
                  {item.metadata?.priority &&
                    getPriorityBadge(item.metadata.priority.key)}
                </div>

                {/* Título */}
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {item.title}
                </h2>

                {/* Fecha y autor */}
                {item.metadata?.publication_date && (
                  <p className="text-gray-400 mb-4">
                    {format(new Date(item.metadata.publication_date), "MMMM dd, yyyy")}
                    {item.metadata?.author && ` • By ${item.metadata.author}`}
                  </p>
                )}

                {/* Contenido resumido */}
                <div
                  className="text-gray-300 line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: item.metadata?.content || "",
                  }}
                />

                {/* Botón */}
                {item.metadata?.related_link && (
                  <a
                    href={item.metadata.related_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block btn btn-primary"
                  >
                    Leer más
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
    </motion.div>
  )
}

export default NewsCarousel
