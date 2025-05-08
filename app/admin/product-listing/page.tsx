"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SelectContent } from '@radix-ui/react-select'
import { Textarea } from '@/components/ui/textarea'

interface ProductFormData {
  name: string
  price: number
  image: string
  category: string
  material: string
  occasion: string
  modelNumber: string
  description: string
  weight: string
  shopFor: string
}

export default function ProductListing() {
  const router = useRouter()
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    image: '',
    category: '',
    material: '',
    occasion: '',
    modelNumber: '',
    description: '',
    weight: '',
    shopFor: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('Product added successfully!')
        router.refresh()
      } else {
        throw new Error('Failed to add product')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to add product')
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Name</label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Price</label>
            <Input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Image URL</label>
            <Input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Category</label>
            <Select name="category" onValueChange={(value) => handleSelectChange('category', value)}>
                <SelectTrigger className='w-[417px]'>
                    <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup className='w-[417px] bg-white border rounded'>
                        <SelectLabel>Category</SelectLabel>
                        <SelectItem value='Necklace'>Necklace</SelectItem>
                        <SelectItem value='Ring'>Ring</SelectItem>
                        <SelectItem value='Earrings'>Earrings</SelectItem>
                        <SelectItem value='Bracelet'>Bracelet</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-2">Material</label>
            <Input
              type="text"
              name="material"
              value={formData.material}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Occasion</label>
            <Input
              type="text"
              name="occasion"
              value={formData.occasion}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Model Number</label>
            <Input
              type="text"
              name="modelNumber"
              value={formData.modelNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Weight</label>
            <Input
              type="text"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Shop For</label>
            <Select name="shopFor" onValueChange={(value) => handleSelectChange('shopFor', value)}>
                <SelectTrigger className='w-[417px]'>
                    <SelectValue placeholder="Select Target" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup className='w-[417px] bg-white border rounded'>
                        <SelectLabel>Select Target</SelectLabel>
                        <SelectItem value='Necklace'>Woman</SelectItem>
                        <SelectItem value='Ring'>Man</SelectItem>
                        <SelectItem value='Earrings'>Unisex</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label className="block mb-2">Description</label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded h-32 resize-none"
          ></Textarea>
        </div>
        <Button
          type="submit"
          className="text-white px-4 py-2 rounded"
        >
          Add Product
        </Button>
      </form>
    </div>
  )
}