import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true 
  },
  items: [{
    productId: { 
      type: String, 
      required: true 
    },
    name: { 
      type: String, 
      required: true 
    },
    price: { 
      type: Number, 
      required: true 
    },
    image: String,
    quantity: { 
      type: Number, 
      default: 1,
      min: 1 
    }
  }],
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();
    const cart = await Cart.findOne({ email });
    
    return NextResponse.json(cart?.items || []);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// Add/Update cart items
export async function POST(request: Request) {
  try {
    const { email, item } = await request.json();

    if (!email || !item) {
      return NextResponse.json(
        { error: 'Email and item are required' },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Find or create cart for user
    let cart = await Cart.findOne({ email });
    
    if (!cart) {
      cart = new Cart({ email, items: [] });
    }

    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(
      (i: any) => i.productId === item.productId
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity = item.quantity;
    } else {
      // Add new item
      cart.items.push(item);
    }

    cart.updatedAt = new Date();
    await cart.save();

    return NextResponse.json(cart.items);
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

// Update item quantity or remove if quantity is 0
export async function PUT(request: Request) {
  try {
    const { email, productId, quantity } = await request.json();

    if (!email || !productId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Email, productId and quantity are required' },
        { status: 400 }
      );
    }

    await connectDB();
    let cart = await Cart.findOne({ email });

    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      cart.items = cart.items.filter((item: any) => item.productId !== productId);
    } else {
      // Update quantity
      const item = cart.items.find((item: any) => item.productId === productId);
      if (item) {
        item.quantity = quantity;
      }
    }

    cart.updatedAt = new Date();
    await cart.save();

    return NextResponse.json(cart.items);
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

// Delete entire cart
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();
    await Cart.findOneAndDelete({ email });

    return NextResponse.json(
      { message: 'Cart deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting cart:', error);
    return NextResponse.json(
      { error: 'Failed to delete cart' },
      { status: 500 }
    );
  }
}