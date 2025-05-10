"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

interface ProductFormData {
  name: string;
  price: number;
  image: string;
  imageFile?: File | null;
  isFavorite: boolean;
  category: string;
  material: string;
  occasion: string;
  modelNumber: string;
  description: string;
  weight: string;
  shopFor: string;
  reviews: number;
  rating: number;
}

export default function ProductListing() {
  const router = useRouter();
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
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (file.size > 99 * 1024 * 1024) {
    toast.error("File size must be less than 99MB");
    return;
  }

  if (!file.type.startsWith('image/')) {
    toast.error("Only image files are allowed");
    return;
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/products', { 
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result = await response.json();
    
    setFormData(prev => ({
      ...prev,
      image: result.secure_url,
      imageFile: file
    }));
  } catch (error) {
    console.error('Error uploading image:', error);
    toast.error('Failed to upload image');
  }
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const productData = {
      ...formData,
      imageFile: undefined 
    };

    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData), 
    });

    if (response.ok) {
      toast.success("Product added successfully!");
      router.refresh();
      // Reset form
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
      });
    } else {
      throw new Error("Failed to add product");
    }
  } catch (error) {
    console.error("Error:", error);
    toast.error("Failed to add product");
  }
};

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
            <label className="block mb-2">Image Upload</label>
            <Input
              type="file"
              id="picture"
              name="image"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 border rounded"
              required
            />
            {formData.image && (
              <div className="relative w-32 h-32">
                <img
                  src={formData.image}
                  alt="Product preview"
                  className="object-cover w-full h-full rounded"
                />
              </div>
            )}
          </div>
          <div>
            <label className="block mb-2">Category</label>
            <Select
              name="category"
              onValueChange={(value) => handleSelectChange("category", value)}
            >
              <SelectTrigger className="w-[417px]">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="w-[417px] bg-white border rounded">
                  <SelectLabel>Category</SelectLabel>
                  <SelectItem value="Necklace">Necklace</SelectItem>
                  <SelectItem value="Ring">Ring</SelectItem>
                  <SelectItem value="Earrings">Earrings</SelectItem>
                  <SelectItem value="Bracelet">Bracelet</SelectItem>
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
            <Select
              name="shopFor"
              onValueChange={(value) => handleSelectChange("shopFor", value)}
            >
              <SelectTrigger className="w-[417px]">
                <SelectValue placeholder="Select Target" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="w-[417px] bg-white border rounded">
                  <SelectLabel>Select Target</SelectLabel>
                  <SelectItem value="Necklace">Woman</SelectItem>
                  <SelectItem value="Ring">Man</SelectItem>
                  <SelectItem value="Earrings">Unisex</SelectItem>
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
        <Button type="submit" className="text-white px-4 py-2 rounded">
          Add Product
        </Button>
      </form>
    </div>
  );
}
