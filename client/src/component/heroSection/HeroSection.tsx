"use client"
import useEmblaCarousel from 'embla-carousel-react'

export function HeroSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })

  const goToPrev = () => emblaApi?.scrollPrev()
  const goToNext = () => emblaApi?.scrollNext()

  return (
    <div className="position-relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom">
          <div className="flex-[0_0_100%]">Slide 1</div>
          <div className="flex-[0_0_100%]">Slide 2</div>
          <div className="flex-[0_0_100%]">Slide 3</div>
        </div>
      </div>

      <button className="mt-3" onClick={goToPrev}>
        Scroll to prev
      </button>
      <button className="mt-3" onClick={goToNext}>
        Scroll to next
      </button>
    </div>
  )
}