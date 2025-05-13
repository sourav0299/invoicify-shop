import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  orderAmount: {
    type: Number,
    required: true
  },
  paymentDetails: {
    paymentId: String,
    orderId: String,
    signature: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    }
  },
  shippingAddress: {
    _id: String,
    name: String,
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  items: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  orderStatus: {
    type: String,
    enum: ['processing', 'confirmed', 'shipped', 'delivered'],
    default: 'processing'
  },
  deliveryDate: {
    expected: Date,
    actual: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export async function POST(request: Request) {
  try {
    await connectDB();

    const {
      userEmail,
      amount,
      paymentId,
      orderId,
      signature,
      selectedAddress,
      items
    } = await request.json();

    // Calculate delivery dates
    const currentDate = new Date();
    const expectedDelivery = new Date(currentDate.getTime() + (7 * 24 * 60 * 60 * 1000));

    const order = await Order.create({
      userEmail,
      orderAmount: amount,
      paymentDetails: {
        paymentId,
        orderId,
        signature,
        status: 'completed'
      },
      shippingAddress: selectedAddress,
      items,
      deliveryDate: {
        expected: expectedDelivery
      }
    });

    // Clear user's cart after order creation
    await mongoose.models.Cart.findOneAndUpdate(
      { email: userEmail },
      { $set: { items: [] } }
    );

    return NextResponse.json({
      success: true,
      order: order
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const orders = await Order.find({ userEmail: email })
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}