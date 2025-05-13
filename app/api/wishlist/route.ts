import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

// Define Wishlist Schema
const wishlistSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  products: [{
    productId: {
      type: String,
      required: true
    },
    name: String,
    price: Number,
    image: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Create or get the model
const Wishlist = mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);

// GET handler to fetch wishlist
export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const wishlist = await Wishlist.findOne({ email });
    return NextResponse.json(wishlist?.products || []);

  } catch (error) {
    console.error('Wishlist GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

// POST handler to add/remove items
export async function POST(request: Request) {
  try {
    await connectDB();
    const { email, product, action } = await request.json();

    if (!email || !product) {
      return NextResponse.json(
        { error: 'Email and product are required' },
        { status: 400 }
      );
    }

    let wishlist = await Wishlist.findOne({ email });

    // Create new wishlist if it doesn't exist
    if (!wishlist) {
      wishlist = new Wishlist({ email, products: [] });
    }

    if (action === 'add') {
      // Check if product already exists
      const exists = wishlist.products.some(
        (p: any) => p.productId === product.productId
      );

      if (!exists) {
        wishlist.products.push(product);
      }
    } else if (action === 'remove') {
      wishlist.products = wishlist.products.filter(
        (p: any) => p.productId !== product.productId
      );
    }

    await wishlist.save();

    return NextResponse.json({
      message: `Product ${action === 'add' ? 'added to' : 'removed from'} wishlist`,
      products: wishlist.products
    });

  } catch (error) {
    console.error('Wishlist POST error:', error);
    return NextResponse.json(
      { error: 'Failed to update wishlist' },
      { status: 500 }
    );
  }
}

// DELETE handler to clear wishlist
export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    await Wishlist.findOneAndUpdate(
      { email },
      { $set: { products: [] } },
      { new: true }
    );

    return NextResponse.json({
      message: 'Wishlist cleared successfully',
      products: []
    });

  } catch (error) {
    console.error('Wishlist DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to clear wishlist' },
      { status: 500 }
    );
  }
}