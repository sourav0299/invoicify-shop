export interface Review {
  id: string
  productId: string
  name: string
  rating: number
  date: string
  content: string
  verified: boolean
}

export interface ProductRatings {
  productId: string
  averageRating: number
  totalReviews: number
  ratingCounts: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export const productRatings: ProductRatings[] = [
  {
    productId: "1",
    averageRating: 4.8,
    totalReviews: 233,
    ratingCounts: {
      5: 65,
      4: 15,
      3: 10,
      2: 0,
      1: 0,
    },
  },
  {
    productId: "2",
    averageRating: 4.5,
    totalReviews: 178,
    ratingCounts: {
      5: 55,
      4: 25,
      3: 15,
      2: 5,
      1: 0,
    },
  },
  {
    productId: "3",
    averageRating: 4.2,
    totalReviews: 95,
    ratingCounts: {
      5: 45,
      4: 30,
      3: 20,
      2: 5,
      1: 0,
    },
  },
  // Default ratings for products without specific ratings
  {
    productId: "default",
    averageRating: 4.0,
    totalReviews: 50,
    ratingCounts: {
      5: 40,
      4: 30,
      3: 20,
      2: 10,
      1: 0,
    },
  },
]

// Sample reviews data
export const reviews: Review[] = [
  // Product 1 reviews
  {
    id: "101",
    productId: "1",
    name: "Karan Arora",
    rating: 5,
    date: "12th April 2025",
    content:
      "Volutpat tortor at quis sed natoque ac. Adipiscing aliquam tortor risus etiam nisi. Curabitur maecenas aliquam posuere consequat nulla. Feugiat arcu turpis suscipit ornare mauris suspendisse duis nisl vitae.",
    verified: true,
  },
  {
    id: "102",
    productId: "1",
    name: "Priya Sharma",
    rating: 5,
    date: "10th April 2025",
    content:
      "Absolutely stunning piece! The craftsmanship is exceptional and the diamonds catch the light beautifully. I've received so many compliments. Delivery was prompt and the packaging was elegant.",
    verified: true,
  },
  {
    id: "103",
    productId: "1",
    name: "Raj Malhotra",
    rating: 4,
    date: "5th April 2025",
    content:
      "Very pleased with this purchase. The quality is excellent and it looks even better in person than in the photos. The only reason for 4 stars instead of 5 is that the clasp is a bit difficult to operate.",
    verified: true,
  },
  {
    id: "104",
    productId: "1",
    name: "Ananya Patel",
    rating: 5,
    date: "28th March 2025",
    content:
      "This piece exceeded my expectations. The attention to detail is remarkable and the stones are of excellent quality. The customer service was also outstanding - they helped me with sizing questions promptly.",
    verified: true,
  },

  // Product 2 reviews
  {
    id: "201",
    productId: "2",
    name: "Vikram Singh",
    rating: 5,
    date: "15th April 2025",
    content:
      "Purchased this as an anniversary gift and my wife absolutely loves it. The emerald is vibrant and the setting is elegant. Excellent value for the price.",
    verified: true,
  },
  {
    id: "202",
    productId: "2",
    name: "Meera Kapoor",
    rating: 4,
    date: "8th April 2025",
    content:
      "Beautiful piece with excellent craftsmanship. The only reason I'm giving 4 stars is because the color is slightly different from what was shown in the photos, but still gorgeous.",
    verified: true,
  },
  {
    id: "203",
    productId: "2",
    name: "Arjun Reddy",
    rating: 3,
    date: "1st April 2025",
    content:
      "The quality is good but the size was smaller than I expected. The customer service was helpful with the return process, but I wish the dimensions were more clearly stated in the description.",
    verified: true,
  },

  // Product 3 reviews
  {
    id: "301",
    productId: "3",
    name: "Neha Gupta",
    rating: 5,
    date: "18th April 2025",
    content:
      "This bracelet is absolutely stunning! The diamonds catch the light beautifully and the gold has a wonderful warm tone. The clasp is secure and easy to use. Highly recommend!",
    verified: true,
  },
  {
    id: "302",
    productId: "3",
    name: "Rohan Mehta",
    rating: 4,
    date: "12th April 2025",
    content:
      "Bought this for my mother's birthday and she loves it. The craftsmanship is excellent and it looks very elegant. Shipping was fast and the packaging was beautiful.",
    verified: true,
  },

  // Default reviews for products without specific reviews
  {
    id: "901",
    productId: "default",
    name: "Karan Arora",
    rating: 5,
    date: "12th April 2025",
    content:
      "Volutpat tortor at quis sed natoque ac. Adipiscing aliquam tortor risus etiam nisi. Curabitur maecenas aliquam posuere consequat nulla. Feugiat arcu turpis suscipit ornare mauris suspendisse duis nisl vitae.",
    verified: true,
  },
  {
    id: "902",
    productId: "default",
    name: "Priya Sharma",
    rating: 4,
    date: "5th April 2025",
    content:
      "Very pleased with this purchase. The quality is excellent and it looks even better in person than in the photos. Would definitely recommend to others looking for quality jewelry.",
    verified: true,
  },
  {
    id: "903",
    productId: "default",
    name: "Raj Malhotra",
    rating: 5,
    date: "28th March 2025",
    content:
      "This piece exceeded my expectations. The attention to detail is remarkable and the stones are of excellent quality. The customer service was also outstanding.",
    verified: true,
  },
]


export const getProductRatings = (productId: string): ProductRatings => {
  const ratings = productRatings.find((r) => r.productId === productId)
  return ratings || productRatings.find((r) => r.productId === "default")!
}


export const getProductReviews = (productId: string): Review[] => {
  const productReviews = reviews.filter((r) => r.productId === productId)
  return productReviews.length > 0 ? productReviews : reviews.filter((r) => r.productId === "default")
}
