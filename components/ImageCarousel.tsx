import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

interface ImageCarouselProps {
    images: string[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
    return (
        <div className="relative w-full"> {/* Relative container for fade + z-index control */}
            <Carousel orientation="horizontal" className="w-full">
                <CarouselContent className="px-4">
                    {images.map((image, index) => (
                        <CarouselItem key={index} className="sm:basis-1 md:basis-1/2 flex items-center justify-center">
                            <img src={image} alt={`Image ${index + 1}`} className="w-full h-auto rounded-lg shadow-2l block" />
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Navigation buttons with z-index so they're not covered */}
                <CarouselPrevious className="z-20 bg-muted-foreground text-white" />
                <CarouselNext className="z-20 bg-muted-foreground text-white" />
            </Carousel>

            {/* Fading edges */}
            <div className="pointer-events-none absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-background to-transparent" />
        </div>
    );
}
