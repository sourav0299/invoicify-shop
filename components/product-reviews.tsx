"use client"

import { useState } from "react"
import { User } from "lucide-react"

interface Review {
  id: string
  productId: string
  name: string
  rating: number
  date: string
  content: string
  verified: boolean
}

interface ProductReviewsProps {
  averageRating: number
  totalReviews: number
  ratingCounts: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  reviews: Review[]
}

const ProductReviews = ({
  averageRating = 4.8,
  totalReviews = 233,
  ratingCounts = {
    5: 65,
    4: 15,
    3: 10,
    2: 0,
    1: 0,
  },
  reviews = [],
}: ProductReviewsProps) => {
  const [visibleReviews, setVisibleReviews] = useState(3)

  const loadMoreReviews = () => {
    setVisibleReviews((prev) => prev + 3)
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-16">
      <h2 className="text-4xl md:text-5xl font-serif text-center mb-16 text-[#1a1a1a]">Ratings and Reviews</h2>

      <div className="flex flex-col md:flex-row md:gap-[32px] justify-center">
       
        <div className="mb-8 md:mb-0 w-full md:w-[480px] h-[324px]">
          <h3 className="text-2xl font-serif mb-6 text-[#1a1a1a]">Customer Ratings</h3>

          <div className="flex items-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className="w-6 h-6 text-[#f8bf3e]"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            ))}
            <span className="ml-2 text-gray-500">({totalReviews} Reviews)</span>
          </div>

          <p className="text-sm text-gray-600 mb-6">{totalReviews} Reviews</p>

          {/* Rating Bars */}
          <div className="space-y-[32px]">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center">
                <span className="w-12 text-sm">{rating} Star</span>
                <div className="flex-1 h-6 mx-4 bg-gray-200 rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-[#f8bf3e]"
                    style={{ width: `${ratingCounts[rating as keyof typeof ratingCounts]}%` }}
                  ></div>
                </div>
                <span className="w-10 text-right text-sm">{ratingCounts[rating as keyof typeof ratingCounts]}%</span>
              </div>
            ))}
          </div>
        </div>

      
        <div className="w-full md:w-[680px]">
          <h3 className="text-2xl font-serif mb-6 text-[#1a1a1a]">Customer Reviews</h3>

          <div className="space-y-[32px]">
            {reviews.slice(0, visibleReviews).map((review) => (
              <div
                key={review.id}
                className="border border-gray-200 rounded-[24px] p-[24px] w-full md:w-[680px] h-[220px] overflow-hidden"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    <User size={20} />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium">{review.name}</h4>
                    <p className="text-sm text-gray-500">Verified customer</p>
                  </div>
                </div>

                <div className="flex items-center mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < review.rating ? "text-[#f8bf3e]" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                </div>

                <p className="text-gray-700 line-clamp-3">{review.content}</p>
              </div>
            ))}
          </div>

          {visibleReviews < reviews.length && (
            <div className="mt-8 text-center">
              <button
                onClick={loadMoreReviews}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                See more
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductReviews
