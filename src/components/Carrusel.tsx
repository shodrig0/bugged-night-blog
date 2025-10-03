
import React from "react"
import Slider from "react-slick"


interface NewsItem {
    id: string
    title: string
    metadata: {
        featured_image?: { imgix_url: string }
    }
}

interface NewsCarouselProps {
    news: NewsItem[]
}

const NewsCarousel: React.FC<NewsCarouselProps> = ({ news }) => {
    const settings = {
        dots: true,
        fade: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        waitForAnimate: false,
        arrows: false,
    }

    return (
        <div className="slider-container">
            <Slider {...settings}>
                {news.map((item) => (
                    <div key={item.id} className="relative h-96 md:h-[500px] w-full">
                        {item.metadata?.featured_image && (
                            <img
                                src={`${item.metadata.featured_image.imgix_url}?w=1200&h=600&fit=crop&auto=format,compress`}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />
                        )}
                        <div className="absolute bottom-4 left-4 bg-black/60 text-white px-4 py-2 rounded">
                            {item.title}
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    )
}

export default NewsCarousel
