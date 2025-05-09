export interface Product {
  [x: string]: any
  id: string
  name: string
  price: number
  image: string
  isFavorite: boolean
  category: string
  material: string
  occasion: string
  modelNumber?: string
  description?: string
  reviews?: number
  rating?: number
  weight?: string
  shopFor?: string
}

export const products: Product[] = [
  {
    id: "1",
    name: "Emerald Necklace",
    price: 50000,
    image: "/products/product-1.png",
    isFavorite: true,
    category: "Necklace",
    material: "Emerald, Diamond and Platinum",
    occasion: "Wedding and Formal",
    modelNumber: "123456",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    reviews: 64,
    rating: 5,
    weight: "200g",
    shopFor: "Woman",
  },
  {
    id: "2",
    name: "Diamond Ring",
    price: 75000,
    image: "/products/product-1.png",
    isFavorite: false,
    category: "Ring",
    material: "Diamond and Gold",
    occasion: "Engagement",
  },
  {
    id: "3",
    name: "Sapphire Earrings",
    price: 30000,
    image: "/products/product-1.png",
    isFavorite: false,
    category: "Earrings",
    material: "Sapphire and Silver",
    occasion: "Casual",
  },
  {
    id: "4",
    name: "Ruby Bracelet",
    price: 40000,
    image: "/products/product-1.png",
    isFavorite: true,
    category: "Bracelet",
    material: "Ruby and Platinum",
    occasion: "Anniversary",
  },
  {
    id: "5",
    name: "Pearl Necklace",
    price: 20000,
    image: "/products/product-1.png",
    isFavorite: false,
    category: "Necklace",
    material: "Pearl and Gold",
    occasion: "Party",
  },
  {
    id: "6",
    name: "Amethyst Ring",
    price: 25000,
    image: "/products/product-1.png",
    isFavorite: false,
    category: "Ring",
    material: "Amethyst and Silver",
    occasion: "Daily Wear",
  },
  {
    id: "7",
    name: "Topaz Earrings",
    price: 15000,
    image: "/products/product-1.png",
    isFavorite: true,
    category: "Earrings",
    material: "Topaz and Gold",
    occasion: "Birthday",
  },
  {
    id: "8",
    name: "Garnet Bracelet",
    price: 18000,
    image: "/products/product-1.png",
    isFavorite: false,
    category: "Bracelet",
    material: "Garnet and Silver",
    occasion: "Date Night",
  },
  {
    id: "9",
    name: "Opal Necklace",
    price: 22000,
    image: "/products/product-1.png",
    isFavorite: false,
    category: "Necklace",
    material: "Opal and Platinum",
    occasion: "Special Occasion",
  },
  {
    id: "10",
    name: "Aquamarine Ring",
    price: 28000,
    image: "/products/product-1.png",
    isFavorite: true,
    category: "Ring",
    material: "Aquamarine and Gold",
    occasion: "Vacation",
  },
]
