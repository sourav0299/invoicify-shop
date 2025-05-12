"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, Clock, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ContactUsPage() {
  // Form state with initial values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  })


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
   
      await new Promise((resolve) => setTimeout(resolve, 1000))

    
      setStatus({
        type: "success",
        message: "Your message has been sent successfully! We'll get back to you soon.",
      })

      
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
    } catch (error) {
      
      setStatus({
        type: "error",
        message: "Failed to send message. Please try again or contact us directly.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-[180px] px-4 md:px-8 lg:px-16 max-w-7xl mx-auto pb-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif text-[#1a1a1a] mb-4">Contact Us</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're here to help with any questions about our products, orders, or services.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        
          <div className="lg:col-span-3 bg-white border border-gray-200 rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-medium mb-6">Send Us a Message</h2>

            {status.type && (
              <div
                className={`mb-6 p-4 rounded-md ${
                  status.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                }`}
              >
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    minLength={2}
                    placeholder="Your name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="Your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Your phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    minLength={5}
                    placeholder="Message subject"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  minLength={10}
                  placeholder="How can we help you?"
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full md:w-auto px-8 bg-[#1a1a1a] hover:bg-black text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 h-full">
              <h2 className="text-2xl font-medium mb-6">Contact Information</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-[#1a1a1a]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Email</h3>
                    <p className="text-gray-600 mt-1">support@nayrajewels.com</p>
                    <p className="text-gray-600">info@nayrajewels.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-[#1a1a1a]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Phone</h3>
                    <p className="text-gray-600 mt-1">+91 100</p>
                    <p className="text-gray-600">+91 101</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-[#1a1a1a]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Business Hours</h3>
                    <p className="text-gray-600 mt-1">Monday - Saturday: 10:00 AM - 8:00 PM</p>
                    <p className="text-gray-600">Sunday: 11:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
