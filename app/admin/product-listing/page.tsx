"use client"
import { useState, useRef } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Copy, RotateCw, Upload } from "lucide-react"

interface ProductFormData {
  name: string
  price: string
  discount: string
  modelNumber: string
  category: string
  gender: string
  description: string
  images: string[]
}

export default function ProductListing() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: "",
    discount: "",
    modelNumber: "",
    category: "",
    gender: "",
    description: "",
    images: [],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newImages = [...formData.images]
    for (let i = 0; i < files.length; i++) {
      if (newImages.length < 5) {
        const imageUrl = URL.createObjectURL(files[i])
        newImages.push(imageUrl)
      }
    }

    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }))
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...formData.images]
    newImages.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }))
  }

  const handleDuplicateImage = (index: number) => {
    if (formData.images.length < 5) {
      const newImages = [...formData.images]
      newImages.push(formData.images[index])
      setFormData((prev) => ({
        ...prev,
        images: newImages,
      }))
    }
  }

  const handleClickUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Submit logic here
    console.log(formData)
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6">
      <div className="border-b pb-4 mb-6">
        <h1 className="text-2xl font-bold">Add new Product</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6">Add Product details</h2>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 text-sm">Enter Product Name</label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Text"
                className="w-full border rounded"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm">Enter Model number</label>
              <Input
                type="text"
                name="modelNumber"
                value={formData.modelNumber}
                onChange={handleChange}
                placeholder="Enter Text"
                className="w-full border rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 text-sm">Category</label>
              <Select name="category" onValueChange={(value) => handleSelectChange("category", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="necklace">Necklace</SelectItem>
                    <SelectItem value="ring">Ring</SelectItem>
                    <SelectItem value="earrings">Earrings</SelectItem>
                    <SelectItem value="bracelet">Bracelet</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-2 text-sm">Shop For</label>
              <Select name="gender" onValueChange={(value) => handleSelectChange("gender", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="unisex">Unisex</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 text-sm">Price</label>
              <Input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter Price"
                className="w-full border rounded"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm">Discount</label>
              <Input
                type="text"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                placeholder="Enter Discount"
                className="w-full border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm">Product Description</label>
            <div className="relative">
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter Text"
                className="w-full p-3 border rounded resize-none h-32"
                maxLength={512}
              />
              <div className="absolute bottom-2 right-3 text-xs text-gray-400">{formData.description.length}/512</div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6">Add Product images</h2>
          <div className="grid grid-cols-3 gap-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative border rounded overflow-hidden h-48">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute right-2 top-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="bg-white p-1.5 rounded-md shadow-md"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDuplicateImage(index)}
                    className="bg-white p-1.5 rounded-md shadow-md"
                  >
                    <Copy size={16} />
                  </button>
                  <button type="button" className="bg-white p-1.5 rounded-md shadow-md">
                    <RotateCw size={16} />
                  </button>
                </div>
              </div>
            ))}
            {formData.images.length < 5 && (
              <div
                onClick={handleClickUpload}
                className="border-2 border-dashed rounded-md h-48 flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload size={24} className="mb-2" />
                <p className="text-center text-sm mb-1">Click to upload or Drag and Drop</p>
                <p className="text-center text-xs text-gray-500">Max 20 MB file size</p>
                <p className="text-center text-xs text-gray-500">Instructions</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                  multiple
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Button type="submit" className="bg-black text-white px-8 py-2 rounded-md hover:bg-gray-800">
            Save
          </Button>
        </div>
      </form>
    </div>
  )
}
