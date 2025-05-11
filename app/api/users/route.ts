import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import mongoose from 'mongoose'

// Add interface for type safety
interface UserAddress {
  name?: string
  street: string
  city: string
  state: string
  zipCode: string
}

interface User {
  email: string
  name: string
  phone?: string
  address?: UserAddress
  isComplete: boolean
  createdAt: Date
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: String,
  address: {
    name: String,
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  isComplete: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const User = mongoose.models.User || mongoose.model('User', userSchema)

export async function GET() {
  try {
    await connectDB()
    const users = await User.find({})
      .select('-__v')
      .sort({ createdAt: -1 }) // Sort by newest first
    
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, phone, address, isComplete } = body as User

    // Validate required fields
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    await connectDB()

    // Check if email already exists
    const existingUser = await User.findOne({ email })
    
    const user = await User.findOneAndUpdate(
      { email },
      { 
        name, 
        phone, 
        address,
        isComplete: isComplete ?? false,
        ...(existingUser ? {} : { createdAt: new Date() })
      },
      { new: true, upsert: true }
    )

    return NextResponse.json(user)
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { error: 'Invalid data provided' },
        { status: 400 }
      )
    }

    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}