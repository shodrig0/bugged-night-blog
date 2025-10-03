"use client"
import React from "react"
import Slider from "react-slick"
import { format } from "date-fns"

// Tipado de las props (puedes ajustarlo según Cosmic)
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
  getCategoryColor: (key: string) => string
  getPriorityBadge: (key: string) => React.ReactNode
}

const NewsCarousel: React.FC<NewsCarouselProps> = ({ news, getCategoryColor, getPriorityBadge }) => {
  const settings = {
  dots: true,
  infinite: true,
  speed: 600,
  slidesToShow: 1,
  slidesToScroll: 1,
  fade: true,
  arrows: false,
  customPaging: (i: number) => (
    <button
      className="w-2 h-2 rounded-full bg-gray-600"
      aria-label={`Go to slide ${i + 1}`}
    />
  ),
}


  return (
    <div className="relative">
      <Slider {...settings}>
        {news.map((item) => (
          <div key={item.id} className="card overflow-hidden">
            <div className="relative h-96 md:h-[500px]">
              {item.metadata?.featured_image && (
                <img
                  src={`${item.metadata.featured_image.imgix_url}?w=1200&h=600&fit=crop&auto=format,compress`}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
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

                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {item.title}
                </h2>

                {item.metadata?.publication_date && (
                  <p className="text-gray-400 mb-4">
                    {format(new Date(item.metadata.publication_date), "MMMM dd, yyyy")}
                    {item.metadata?.author && ` • By ${item.metadata.author}`}
                  </p>
                )}

                <div
                  className="text-gray-300 line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: item.metadata?.content || "",
                  }}
                />

                {item.metadata?.related_link && (
                  <a
                    href={item.metadata.related_link}
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
        ))}
      </Slider>
    </div>
  )
}

export default NewsCarousel
