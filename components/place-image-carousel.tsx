"use client"

import { useRef } from "react"
import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export function PlaceImageCarousel({
  images,
  alt,
}: {
  images: string[]
  alt: string
}) {
  const autoplay = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })
  )

  return (
    <Carousel
      className="mt-6 w-full"
      opts={{ loop: images.length > 1 }}
      plugins={images.length > 1 ? [autoplay.current] : []}
    >
      <CarouselContent>
        {images.map((src, index) => (
          <CarouselItem key={src}>
            <div
              role="img"
              aria-label={`${alt} photo ${index + 1} of ${images.length}`}
              className="aspect-video w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${src})` }}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      {images.length > 1 && (
        <>
          <CarouselPrevious className="left-3 border-transparent bg-black/60 text-white hover:bg-black/80 hover:text-white" />
          <CarouselNext className="right-3 border-transparent bg-black/60 text-white hover:bg-black/80 hover:text-white" />
        </>
      )}
    </Carousel>
  )
}
