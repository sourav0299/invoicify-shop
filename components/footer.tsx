"use client";

import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-[#0D0D0D] text-white w-full">
      {/* Newsletter*/}
      <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-16 border-b border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h4 className="text-sm uppercase tracking-widest text-gray-400 mb-3">Newsletter</h4>
            <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">
              Get Monthly Updates
            </h2>
            <p className="text-gray-400 text-base md:text-lg">
              Nunc habitasse nibh nam blandit. Diam mauris sed mi eu egestas est gravida.
            </p>
          </div>
          <div className="flex flex-col md:items-end">
            <label htmlFor="email" className="sr-only">
              Your Email address
            </label>
            <div className="flex flex-col md:flex-row w-full md:w-auto space-y-4 md:space-y-0 md:space-x-4 mt-4">
              <input
                type="email"
                id="email"
                placeholder="Enter email address"
                className="flex-1 px-5 py-3 rounded-md bg-[#1e1e1e] text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-base"
              />
              <button className="px-6 py-3 bg-white text-black rounded-md hover:bg-gray-200 text-base font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links*/}
      <div className="max-w-screen-xl mx-auto px-6 md:px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-13">
        <div className="flex items-start space-x-4">
          <Image src="/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
          <Image
            src="/Nayra Jewels.png"
            alt="Nayra Jewels"
            width={160}
            height={50}
            className="object-contain"
          />
        </div>

        {/*Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm md:text-base">
          {/*Products */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Products</h4>
            <ul className="space-y-3 text-gray-400">
              <li>Earrings</li>
              <li>Necklace</li>
              <li>Bracelet</li>
              <li>Ring</li>
              <li>Brooche</li>
              <li>Men’s Jewelry</li>
            </ul>
          </div>
          {/*Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-gray-400">
              <li>About Us</li>
              <li>Testimonials</li>
              <li>Best Seller</li>
              <li>New Arrivals</li>
              <li>Latest Update</li>
            </ul>
          </div>
          {/*Account */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Account</h4>
            <ul className="space-y-3 text-gray-400">
              <li>Orders</li>
              <li>Wishlist</li>
              <li>Payment Info</li>
              <li>Addresses</li>
              <li>Personal Info</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-3 text-gray-400">
              <li>Size Charts</li>
              <li>Payment Guide</li>
              <li>Help Centre</li>
              <li>Privacy Policy</li>
              <li>Return Policy</li>
              <li>FAQs</li>
            </ul>
          </div>
        </div>
      </div>
      {/*Bottom */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-8 pt-6 pb-10 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
        <p>© 2022 Perumnas. All rights reserved</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms & Condition</a>
          <a href="#" className="hover:text-white">Sitemap</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
