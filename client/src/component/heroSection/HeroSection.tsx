"use client"
import useEmblaCarousel from 'embla-carousel-react'
import Fade from 'embla-carousel-fade'
import {  NextButton, PrevButton, usePrevNextButtons } from '../ui/emblaCarouselButton/EmblaCarouselArrow'
import heroData from '@/component/heroSection/heroData.json'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
export function HeroSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Fade(),Autoplay({delay: 4000})])

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom">
          {heroData.map((item) => (
            <div key={item.id} className='flex-[0_0_100%] relative h-150'>
              <Image src={item.imageUrl} alt={item.title} fill
                     priority className='object-cover'/>
              <div className='absolute top-1/2 left-0 flex flex-col  pl-15 w-1/2 text-white transform -translate-y-1/2'>
                <span className='text-lg font-bold text-yellow-500'>{item.subTitle}</span>
                <h2 className='text-3xl font-bold'>{item.title}</h2>
                <p className='pt-2 text-lg'>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} className= {`absolute top-[50%] left-0 transform -translate-y-1/2`}/>
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} className= {`absolute top-[50%] right-0 transform -translate-y-1/2`}/>
        </div>
    </div>
  )
}