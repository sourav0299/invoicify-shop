import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import mongoose from 'mongoose'

interface UserAddress {
    name?: string
    street: string
    city: string
    state: string
    zipCode: string
  }

interface UserUpdate {
    name: string
    phone?: string
    address?: UserAddress
    isComplete?: boolean
  }

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  phone: String,
  address: {
    name: String,
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  isComplete: Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const User = mongoose.models.User || mongoose.model('User', userSchema)

// GET user by email
export async function GET(
  request: Request,
  { params }: { params: { email: string } }
) {
  try {
    const email = params.email.toLowerCase()
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    await connectDB()
    let user = await User.findOne({ email }).select('-__v')
    
    if (!user) {
      user = await User.create({
        email,
        name: email.split('@')[0],
        isComplete: false
      })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { email: string } }
) {
  try {
    const email = params.email.toLowerCase()
    const body = await request.json()
    const { name, phone, address, isComplete } = body as UserUpdate

    // Validate required fields
    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Name is required and cannot be empty' },
        { status: 400 }
      )
    }

    await connectDB()

    const updateData = {
      name: name.trim(),
      ...(phone && { phone }),
      ...(address && { address }),
      isComplete: typeof isComplete === 'boolean' ? isComplete : false
    }

    const user = await User.findOneAndUpdate(
      { email },
      updateData,
      { 
        new: true, 
        runValidators: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    )

    if (!user) {
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      )
    }

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