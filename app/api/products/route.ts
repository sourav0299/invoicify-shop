import { v2 as cloudinary } from "cloudinary"
import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Product from "../../../models/Product"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})


interface ProductData {
  name?: string
  price?: number | string
  category?: string
  description?: string
  image?: string
  [key: string]: any 
}


interface MongoDBValidationError extends Error {
  name: string
  errors?: Record<string, any>
}

// Helper function to validate product data with proper typing
const validateProductData = (data: ProductData) => {
  const errors: Record<string, string> = {}

  if (!data.name || typeof data.name !== "string" || data.name.trim() === "") {
    errors.name = "Product name is required"
  }

  if (
    data.price === undefined ||
    (typeof data.price !== "number" && (typeof data.price !== "string" || isNaN(Number(data.price)))) ||
    Number(data.price) <= 0
  ) {
    errors.price = "Valid product price is required"
  }

  if (!data.category || typeof data.category !== "string" || data.category.trim() === "") {
    errors.category = "Product category is required"
  }

  return Object.keys(errors).length > 0 ? errors : null
}


function isMongoDBValidationError(error: unknown): error is MongoDBValidationError {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as any).name === "ValidationError" &&
    "errors" in error
  )
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || ""

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData()
      const file = formData.get("file") as File

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 })
      }

      
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
          { status: 400 },
        )
      }

    
      const maxSize = 5 * 1024 * 1024 
      if (file.size > maxSize) {
        return NextResponse.json({ error: "File size exceeds the 5MB limit." }, { status: 400 })
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "auto",
              folder: "shop-products",
              transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
            },
            (error, result) => {
              if (error) reject(error)
              resolve(result)
            },
          )
          .end(buffer)
      })

      return NextResponse.json(result)
    } else {
      await connectDB()
      const productData = (await request.json()) as ProductData

     
      const validationErrors = validateProductData(productData)
      if (validationErrors) {
        return NextResponse.json({ error: "Validation failed", details: validationErrors }, { status: 400 })
      }

      const newProduct = new Product({
        ...productData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      await newProduct.save()

      return NextResponse.json({ message: "Product created successfully", product: newProduct }, { status: 201 })
    }
  } catch (error: unknown) {
    console.error("Error:", error)

    
    if (isMongoDBValidationError(error)) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

   
    return NextResponse.json({ error: "Operation failed" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    await connectDB()

  
    const { searchParams } = new URL(request.url)

    // Extract search parameters
    const search = searchParams.get("search")
    const category = searchParams.get("category")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const sort = searchParams.get("sort") || "createdAt"
    const order = searchParams.get("order") || "desc"

    // Pagination parameters
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const skip = (page - 1) * limit

    
    let query: any = {}

    // Search functionality
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
        ],
      }
    }

    // Category filter
    if (category) {
      query.category = category
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number.parseFloat(minPrice)
      if (maxPrice) query.price.$lte = Number.parseFloat(maxPrice)
    }

    // Determine sort order
    const sortOptions: any = {}
    sortOptions[sort] = order === "asc" ? 1 : -1

    // For backward compatibility, if no parameters are provided, return all products
    if (Object.keys(searchParams).length === 0) {
      const products = await Product.find({}).sort({ createdAt: -1 })
      return NextResponse.json(products)
    }

    // Count total products for pagination
    const total = await Product.countDocuments(query)

    // Execute query with pagination and sorting
    const products = await Product.find(query).sort(sortOptions).skip(skip).limit(limit)

    // Return products with pagination metadata
    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: unknown) {
    console.error("Error fetching products:", error)

    // Return a generic error message
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
