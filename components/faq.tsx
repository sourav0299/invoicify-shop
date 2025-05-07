"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

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
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-8 flex flex-col justify-center items-center bg-gray-50">
      {/* Decorative Images */}
      <div className="absolute top-4 left-4">
        <Image src="/faq/left-ring.png" alt="Left Ring" width={300} height={300} />
      </div>
      <div className="absolute bottom-3 right-4">
        <Image src="/faq/right-rings.png" alt="Right Rings" width={250} height={250} />
      </div>

      {/* FAQ Content */}
      <div className="max-w-5xl w-full z-10">
        <h2 className="text-5xl font-serif text-center mb-10 text-[#1a1a1a]">Product FAQs</h2>
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg mb-6 shadow-md transition-all"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="flex justify-between items-center w-full px-6 py-4 text-left"
            >
              <span className="text-lg font-medium text-gray-800">{faq.question}</span>
              <ChevronDown
                className={`transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`px-6 text-gray-700 overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-48 py-3' : 'max-h-0'
              }`}
            >
              <p className="text-sm">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;