import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Product from "@/models/Product"
import { v2 as cloudinary } from "cloudinary"


interface MongoDBValidationError extends Error {
  name: string
  errors?: Record<string, any>
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


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})


const isValidProductId = (id: string) => {
  return id && id.trim().length > 0
}


export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
   
    if (!isValidProductId(params.id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    await connectDB()

    const { searchParams } = new URL(request.url)
    const includeRelated = searchParams.get("includeRelated") === "true"

    const product = await Product.findOne({ id: params.id })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

  
    if (includeRelated && product.category) {
      const relatedProducts = await Product.find({
        category: product.category,
        id: { $ne: params.id }, 
      })
        .limit(4)
        .select("id name price image category") 

      return NextResponse.json({
        product,
        relatedProducts,
      })
    }

    return NextResponse.json(product)
  } catch (error: unknown) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}


export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
   
    if (!isValidProductId(params.id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    await connectDB()

    
    let productData
    try {
      productData = await request.json()
    } catch (e) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    
    const existingProduct = await Product.findOne({ id: params.id })

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    
    if (productData.image && productData.image !== existingProduct.image) {
     
      if (existingProduct.image) {
        try {
          const publicId = existingProduct.image.split("/").pop()?.split(".")[0]
          if (publicId) {
            await cloudinary.uploader.destroy(`shop-products/${publicId}`)
          }
        } catch (cloudinaryError) {
          console.error("Error deleting old image from Cloudinary:", cloudinaryError)
          
        }
      }
    }

   
    const updatedProduct = await Product.findOneAndUpdate(
      { id: params.id },
      {
        ...productData,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true },
    )

    return NextResponse.json({
      message: "Product updated successfully",
      product: updatedProduct,
    })
  } catch (error: unknown) {
    console.error("Error updating product:", error)

    // Handle validation errors
    if (isMongoDBValidationError(error)) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}


export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
   
    if (!isValidProductId(params.id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    await connectDB()

   
    const product = await Product.findOne({ id: params.id })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    
    if (product.image) {
      try {
        const publicId = product.image.split("/").pop()?.split(".")[0]
        if (publicId) {
          const cloudinaryResult = await cloudinary.uploader.destroy(`shop-products/${publicId}`)
          console.log("Cloudinary delete result:", cloudinaryResult)
        }
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError)
       
      }
    }

    
    await Product.findOneAndDelete({ id: params.id })

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 })
  } catch (error: unknown) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}


export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {

    if (!isValidProductId(params.id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    await connectDB()

    // Parse and validate request body
    let productData
    try {
      productData = await request.json()
    } catch (e) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

   
    const existingProduct = await Product.findOne({ id: params.id })

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

  
    if (productData.image && productData.image !== existingProduct.image) {
    
      if (existingProduct.image) {
        try {
          const publicId = existingProduct.image.split("/").pop()?.split(".")[0]
          if (publicId) {
            await cloudinary.uploader.destroy(`shop-products/${publicId}`)
          }
        } catch (cloudinaryError) {
          console.error("Error deleting old image from Cloudinary:", cloudinaryError)
        }
      }
    }

 
    const updatedProduct = await Product.findOneAndUpdate(
      { id: params.id },
      {
        ...productData,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true },
    )

    return NextResponse.json({
      message: "Product updated successfully",
      product: updatedProduct,
    })
  } catch (error: unknown) {
    console.error("Error updating product:", error)

    
    if (isMongoDBValidationError(error)) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}
