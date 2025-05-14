import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '../../../models/Product';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      
      if (!file) {
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'shop-products',
          },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        ).end(buffer);
      });

      return NextResponse.json(result);
    } 
    else {
      await connectDB();
      const productData = await request.json();

      const newProduct = new Product({
        ...productData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await newProduct.save();

      return NextResponse.json(
        { message: 'Product created successfully', product: newProduct },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Operation failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}