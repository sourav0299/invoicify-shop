"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Trash2, Edit, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BannerSection {
  id: string
  title: string
  banners: {
    id: string
    file: File | null
    preview: string | null
  }[]
}

interface CategoryBanner {
  id: string
  file: File | null
  preview: string | null
}

export default function BannerManagementPage() {
  const [sections, setSections] = useState<BannerSection[]>([
    {
      id: "hero",
      title: "Hero Banner",
      banners: [],
    },
    {
      id: "homepage",
      title: "Homepage ad Banner",
      banners: [],
    },
    {
      id: "dropdown",
      title: "Dropdown ad Banner",
      banners: [],
    },
  ])


  const [categoryBanners, setCategoryBanners] = useState<Record<string, CategoryBanner | null>>({})

 
  const topCategories = ["All Jewelry", "Gold", "Diamond", "Earrings", "Rings", "Collection"]
  const bottomCategories = ["Daily wear", "Wedding", "Gifting"]

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const handleFileSelect = (sectionId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return

    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onloadend = () => {
      setSections((prevSections) =>
        prevSections.map((section) => {
          if (section.id === sectionId) {
            return {
              ...section,
              banners: [
                ...section.banners,
                {
                  id: Date.now().toString(),
                  file: file,
                  preview: reader.result as string,
                },
              ],
            }
          }
          return section
        }),
      )
    }

    if (file) {
      reader.readAsDataURL(file)
    }

   
    event.target.value = ""
  }

  const handleCategoryFileSelect = (category: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return

    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onloadend = () => {
      setCategoryBanners((prev) => ({
        ...prev,
        [category]: {
          id: Date.now().toString(),
          file: file,
          preview: reader.result as string,
        },
      }))
    }

    if (file) {
      reader.readAsDataURL(file)
    }

    event.target.value = ""
  }

  const triggerFileInput = (refKey: string) => {
    if (fileInputRefs.current[refKey]) {
      fileInputRefs.current[refKey]?.click()
    }
  }

  const deleteCategoryBanner = (category: string) => {
    setCategoryBanners((prev) => {
      const newBanners = { ...prev }
      delete newBanners[category]
      return newBanners
    })
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-6 max-w-[1400px] mx-auto">
       
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Banner Management</h1>
            <p className="text-gray-500">Manage your Banner here</p>
          </div>
          <Button className="bg-black hover:bg-gray-800 text-white">Save</Button>
        </div>

      
        {sections.slice(0, 2).map((section) => (
          <div key={section.id} className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">{section.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         
              {section.banners.map((banner) => (
                <div
                  key={banner.id}
                  className="relative rounded-lg overflow-hidden border border-gray-200"
                  style={{ width: "432px", height: "216px" }}
                >
                  <img src={banner.preview || ""} alt="Uploaded banner" className="w-full h-full object-cover" />
                
                </div>
              ))}

              
              <div
                className="relative rounded-lg overflow-hidden border border-gray-200 flex flex-col items-center justify-center bg-white cursor-pointer"
                style={{ width: "432px", height: "216px" }}
                onClick={() => triggerFileInput(`${section.id}-upload`)}
              >
                <input
                  type="file"
                  ref={(el) => {
                    if (el) fileInputRefs.current[`${section.id}-upload`] = el
                  }}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(section.id, e)}
                />
                <Upload className="h-6 w-6 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-1">Click to upload or Drag and Drop</p>
                <p className="text-xs text-gray-400">Max 20 MB file size</p>
              </div>
            </div>
          </div>
        ))}

      
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold mb-4">Dropdown ad Banner</h2>

      
          <div className="flex flex-wrap gap-4 mb-4">
            {topCategories.map((category) => (
              <div key={category} className="text-center">
                <p className="text-sm font-medium mb-2">{category}</p>
                <div
                  className="relative rounded-lg overflow-hidden border border-gray-200 mx-auto"
                  style={{ height: "216px", width: "144px", borderRadius: "12px" }}
                >
                  {categoryBanners[category] ? (
                    <>
                      <img
                        src={categoryBanners[category]?.preview || ""}
                        alt={`${category} banner`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex flex-col gap-2">
                        <button
                          className="bg-white p-1.5 rounded-md shadow-md"
                          onClick={() => deleteCategoryBanner(category)}
                        >
                          <Trash2 size={16} className="text-gray-700" />
                        </button>
                        <button className="bg-white p-1.5 rounded-md shadow-md">
                          <Edit size={16} className="text-gray-700" />
                        </button>
                        <button className="bg-white p-1.5 rounded-md shadow-md">
                          <Eye size={16} className="text-gray-700" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div
                      className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                      onClick={() => triggerFileInput(`category-${category}`)}
                    >
                      <input
                        type="file"
                        ref={(el) => {
                          if (el) fileInputRefs.current[`category-${category}`] = el
                        }}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleCategoryFileSelect(category, e)}
                      />
                      <Upload className="h-5 w-5 text-gray-400 mb-1" />
                      <p className="text-xs text-gray-500">Click to upload or Drag and Drop</p>
                      <p className="text-[10px] text-gray-400">Max 10 MB file size</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

      
          <div className="flex flex-wrap gap-4">
            {bottomCategories.map((category) => (
              <div key={category} className="text-center">
                <p className="text-sm font-medium mb-2">{category}</p>
                <div
                  className="relative rounded-lg overflow-hidden border border-gray-200 mx-auto"
                  style={{ height: "216px", width: "144px", borderRadius: "12px" }}
                >
                  {categoryBanners[category] ? (
                    <>
                      <img
                        src={categoryBanners[category]?.preview || ""}
                        alt={`${category} banner`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex flex-col gap-2">
                        <button
                          className="bg-white p-1.5 rounded-md shadow-md"
                          onClick={() => deleteCategoryBanner(category)}
                        >
                          <Trash2 size={16} className="text-gray-700" />
                        </button>
                        <button className="bg-white p-1.5 rounded-md shadow-md">
                          <Edit size={16} className="text-gray-700" />
                        </button>
                        <button className="bg-white p-1.5 rounded-md shadow-md">
                          <Eye size={16} className="text-gray-700" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div
                      className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
                      onClick={() => triggerFileInput(`category-${category}`)}
                    >
                      <input
                        type="file"
                        ref={(el) => {
                          if (el) fileInputRefs.current[`category-${category}`] = el
                        }}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleCategoryFileSelect(category, e)}
                      />
                      <Upload className="h-5 w-5 text-gray-400 mb-1" />
                      <p className="text-xs text-gray-500">Click to upload or Drag and Drop</p>
                      <p className="text-[10px] text-gray-400">Max 10 MB file size</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
