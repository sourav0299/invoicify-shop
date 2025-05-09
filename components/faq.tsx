"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"

const FAQ = () => {
  const faqs = [
    {
      question: "What skin types are your products suitable for?",
      answer:
        "Our products are designed to cater to a variety of skin types, including dry, oily, combination, and sensitive skin. We provide detailed descriptions for each product to help you choose the best option for your specific needs.",
    },
    {
      question: "Are your products cruelty-free?",
      answer: "Yes, all our products are cruelty-free and not tested on animals.",
    },
    {
      question: "Can I determine which products are right for me?",
      answer: "Yes, we offer guides and consultations to help you find the right products.",
    },
    {
      question: "Do you offer any samples or travel sizes?",
      answer: "We do offer travel sizes for selected products. Please check product pages.",
    },
    {
      question: "What is your return policy?",
      answer: "You can return products within 30 days of purchase with original packaging.",
    },
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="relative py-20 px-4 sm:px-8 bg-white">
      {/* Decorative Images */}
      <div
        className="absolute top-40 left-10 hidden md:block"
        style={{
          top: "15%",
          transformOrigin: "center",
        }}
      >
        <Image src="/faq/left-ring.png" alt="Gold Ring" width={180} height={240} className="object-contain" />
      </div>
      <div
        className="absolute right-10 hidden md:block"
        style={{
          transform: "rotate(11.72deg)",
          transformOrigin: "center",
          top: "50%",
        }}
      >
        <Image src="/faq/right-ring.png" alt="Gold Bangles" width={180} height={240} className="object-contain" />
      </div>

      {/* FAQ Content */}
      <div className="mx-auto z-10" style={{ width: "900px", height: "756px" }}>
        <h2 className="text-5xl font-serif text-center mb-12 text-[#1a1a1a]">Product FAQs</h2>

        <div className="space-y-6">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index

            return (
              <div key={index} className="border border-gray-200 rounded-sm overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex justify-between items-center w-full px-8 py-6 text-left"
                >
                  <span className="text-xl font-serif text-gray-800">{faq.question}</span>
                  <div className="flex-shrink-0">
                    <ChevronDown
                      className={`h-6 w-6 text-gray-500 transition-transform duration-300 ease-in-out ${
                        isOpen ? "transform rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-8 pb-6 text-gray-600">
                    <p className="text-base">{faq.answer}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default FAQ
