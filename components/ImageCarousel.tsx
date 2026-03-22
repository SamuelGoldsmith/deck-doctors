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
        <div className="relative w-full justify-center">
            <Carousel orientation="horizontal" className="sm:w-5/10 sm:mx-auto md:w-full  ">
                <CarouselContent className=" ">
                    {images.map((image, index) => (
                        <CarouselItem key={index} className="sm:basis-1 md:basis-1/2 flex items-center justify-center">
                            <img src={image} alt={`Image ${index + 1}`} className="w-full h-auto rounded-sm shadow-2l block" />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" variant={"default"}/>
                <CarouselNext className="hidden md:flex" variant={"default"}/>
            </Carousel>
        </div>
    );
}
