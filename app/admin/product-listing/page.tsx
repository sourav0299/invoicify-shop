"use client"
import { useState, useRef } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Copy, RotateCw, Upload } from "lucide-react"
import toast from "react-hot-toast"

interface ProductFormData {
  name: string
  price: number
  image: string
  imageFile: File | null
  isFavorite: boolean
  category: string
  material: string
  occasion: string
  modelNumber: string
  description: string
  weight: string
  shopFor: string
  reviews: number
  rating: number
}

export default function ProductListing() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: 0,
    image: "",
    isFavorite: false,
    category: "",
    material: "",
    occasion: "",
    modelNumber: "",
    description: "",
    weight: "",
    shopFor: "",
    reviews: 0,
    rating: 0,
    imageFile: null,
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

  const handleImageUpload = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file)return ;
    if(file.size > 99*1024*1024){
      toast.error("File size must be less than 99MB")
      return;
    }
    if(!file.type.startsWith('image/')){
      toast.error('Only image file are allowed')
    }
    try{
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/products',{
        method: 'POST',
        body: formData,
      });
      if(!response.ok){
        throw new Error('Upload failed');
      }
      const result = await response.json();
      setFormData(prev => ({
        ...prev,
        image: result.secure_url,
        imageFile: file
      }));
    }catch(error){
      console.error('Error uploading image:', error)
      toast.error('Failed to upload Image')
    }
  }

  const handleRemoveImage = (index: number) => {
    toast.error("Try Again Later")
  }

  const handleDuplicateImage = (index: number) => {
    toast.error("Try Again Later")
  }

  const handleClickUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    try{
      const productData = {
        ...formData,
        imageFile: undefined
      };
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(productData),
      });
      if(response.ok){
        toast.success("Product added successfully!");
        setFormData({
          name: "",
          price: 0,
          image: "",
          isFavorite: false,
          category: "",
          material: "",
          occasion: "",
          modelNumber: "",
          description: "",
          weight: "",
          shopFor: "",
          reviews: 0,
          rating: 0,
          imageFile: null,
        })
      }else{
        throw new Error("Failed to add product")
      }
    }catch(error){
      console.log("Error:", error);
      toast.error("Failed to add product");
    }
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
                placeholder="eg: Ring"
                className="w-full border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm">Enter Price of product</label>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border rounded"
                required
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
              <label className="block mb-2 text-sm">Enter Product Material</label>
              <Input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleChange}
                placeholder="eg: Cotton"
                className="w-full border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm">Occasion</label>
              <Input
                type="text"
                name="occasion"
                value={formData.occasion}
                onChange={handleChange}
                placeholder="eg: wedding"
                className="w-full border rounded"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 text-sm">Weight of Product</label>
              <Input
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Eg: 200g"
                className="w-full border rounded"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm">Product Model Number</label>
              <Input
                type="text"
                name="modelNumber"
                value={formData.modelNumber}
                onChange={handleChange}
                placeholder="Eg: MODEL001"
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
            {formData.image &&  (
              <div className="relative border rounded overflow-hidden h-48">
                <img
                  src={formData.image || "/placeholder.svg"}
                  alt={`Product ${formData.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {formData.image.length < 5 && (
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
