import {
  Card,
  CardContent,
  CardTitle,
} from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

const TestCarousel = () => {
  return (
    <Carousel className="w-full max-w-2xl">
      <CarouselContent className="w-full">
        <CarouselItem className="">
          <div className="p-1">
            <Card>
              <CardTitle className="text-center">{"Test"}</CardTitle>
              <CardContent className="flex justify-center items-center p-6 aspect-square">
                <span className="font-semibold text-2xl">{1}</span>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>

        <CarouselItem className="">
          <div className="p-1">
            <Card>
              <CardTitle className="text-center">{"Test"}</CardTitle>
              <CardContent className="flex justify-center items-center p-6 aspect-square">
                <span className="font-semibold text-2xl">{1}</span>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default TestCarousel;
