"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface CarouselContextProps {
  currentIndex: number
  setCurrentIndex: (index: number) => void
  totalItems: number
  setTotalItems: (total: number) => void
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }
  return context
}

interface CarouselProps {
  currentIndex?: number
  onIndexChange?: (index: number) => void
}

const Carousel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CarouselProps>(
  ({ className, children, currentIndex: controlledIndex, onIndexChange, ...props }, ref) => {
    const [internalIndex, setInternalIndex] = React.useState(0)
    const currentIndex = controlledIndex !== undefined ? controlledIndex : internalIndex

    const setCurrentIndex = (index: number) => {
      if (controlledIndex !== undefined && onIndexChange) {
        onIndexChange(index)
      } else {
        setInternalIndex(index)
      }
    }

    return (
      <CarouselContext.Provider
        value={{
          currentIndex,
          setCurrentIndex,
          totalItems: 0, // Initialize totalItems to 0
          setTotalItems: () => {}, // Provide an empty function for setTotalItems
        }}
      >
        <div ref={ref} className={cn("relative", className)} {...props}>
          {children}
        </div>
      </CarouselContext.Provider>
    )
  },
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { currentIndex, setTotalItems } = useCarousel()

    React.useEffect(() => {
      const childrenArray = React.Children.toArray(children)
      setTotalItems(childrenArray.length)
    }, [children, setTotalItems])

    return (
      <div className="overflow-hidden" ref={ref} {...props}>
        <div
          className={cn("flex transition-transform duration-500 ease-in-out", className)}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {children}
        </div>
      </div>
    )
  },
)
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("min-w-0 shrink-0 grow-0 basis-full", className)} {...props} />
  },
)
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { currentIndex, setCurrentIndex, totalItems } = useCarousel()

    const handlePrevious = () => {
      setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : totalItems - 1)
    }

    return (
      <button
        ref={ref}
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 z-10",
          "h-8 w-8 rounded-full bg-white/80 hover:bg-white",
          "flex items-center justify-center shadow-md",
          "transition-all duration-200 hover:scale-110",
          className,
        )}
        onClick={handlePrevious}
        {...props}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous slide</span>
      </button>
    )
  },
)
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { currentIndex, setCurrentIndex, totalItems } = useCarousel()

    const handleNext = () => {
      setCurrentIndex(currentIndex < totalItems - 1 ? currentIndex + 1 : 0)
    }

    return (
      <button
        ref={ref}
        className={cn(
          "absolute right-4 top-1/2 -translate-y-1/2 z-10",
          "h-8 w-8 rounded-full bg-white/80 hover:bg-white",
          "flex items-center justify-center shadow-md",
          "transition-all duration-200 hover:scale-110",
          className,
        )}
        onClick={handleNext}
        {...props}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next slide</span>
      </button>
    )
  },
)
CarouselNext.displayName = "CarouselNext"

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext }
