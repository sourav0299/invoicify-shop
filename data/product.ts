export interface Product {
    id: string
    name: string
    price: number
    image: string
    isFavorite?: boolean
    category: string
    material: string
    occasion?: string
  }
  
  export const products: Product[] = [
    {
      id: "1",
      name: "Charming necklace",
      price: 80000,
      image: "/products/product-1.png",
      isFavorite: true,
      category: "Necklace",
      material: "Gold",
      occasion: "Formal",
    },
    {
      id: "2",
      name: "Charming necklace",
      price: 80000,
      image: "/products/product-1.png",
      category: "Necklace",
      material: "Gold",
      occasion: "Wedding",
    },
    {
      id: "3",
      name: "Charming necklace",
      price: 80000,
      image: "/products/product-1.png",
      category: "Necklace",
      material: "Gold",
      occasion: "Casual",
    },
    {
      id: "4",
      name: "Charming necklace",
      price: 80000,
      image: "/products/product-1.png",
      category: "Necklace",
      material: "Gold",
      occasion: "Formal",
    },
    {
      id: "5",
      name: "Charming necklace",
      price: 80000,
      image: "/products/product-1.png",
      category: "Necklace",
      material: "Gold",
      occasion: "Modern",
    },
    {
      id: "6",
      name: "Charming necklace",
      price: 80000,
      image: "/products/product-1.png",
      category: "Necklace",
      material: "Gold",
      occasion: "Traditional and ethnic",
    },
    {
      id: "7",
      name: "Charming necklace",
      price: 80000,
      image: "/products/product-1.png",
      category: "Necklace",
      material: "Gold",
      occasion: "Engagement",
    },
    {
      id: "8",
      name: "Charming necklace",
      price: 80000,
      image: "/products/product-1.png",
      category: "Necklace",
      material: "Gold",
      occasion: "Wedding",
    },
  ]
  