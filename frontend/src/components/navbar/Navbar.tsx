"use client";
import React, { useState } from "react";
import { FaTachometerAlt, FaUsers, FaBoxes, FaTasks } from "react-icons/fa"; // Add icons for each section
import Link from "next/link"; // Import Link from Next.js
import { usePathname } from "next/navigation"; // Correctly import usePathname for current route

const Navbar = () => {
  const pathname = usePathname(); // Get the current path
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Track mobile menu state

  // Toggle mobile menu
  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className="bg-blue-400 p-6 mb-2">
      <nav className="flex justify-between items-center container mx-auto text-white">
        <div className="text-2xl font-bold">Smart Delivery</div>
        
        {/* Hamburger Icon for Mobile */}
        <div className="lg:hidden" onClick={handleMenuToggle}>
          <button className="text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Links for larger screens */}
        <div className="hidden lg:flex space-x-6">
          {/* Dashboard Link */}
          <Link
            href="/"
            className={`relative flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${
              pathname === "/" ? "bg-teal-500" : "hover:bg-teal-500"
            }`}
          >
            <FaTachometerAlt className="text-xl" />
            <span>Dashboard</span>
          </Link>

          {/* Partners Link */}
          <Link
            href="/partners"
            className={`relative flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${
              pathname === "/partners" ? "bg-teal-500" : "hover:bg-teal-500"
            }`}
          >
            <FaUsers className="text-xl" />
            <span>Partners</span>
          </Link>

          {/* Orders Link */}
          <Link
            href="/orders"
            className={`relative flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${
              pathname === "/orders" ? "bg-teal-500" : "hover:bg-teal-500"
            }`}
          >
            <FaBoxes className="text-xl" />
            <span>Orders</span>
          </Link>

          {/* Assignments Link */}
          <Link
            href="/assignments"
            className={`relative flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${
              pathname === "/assignments" ? "bg-teal-500" : "hover:bg-teal-500"
            }`}
          >
            <FaTasks className="text-xl" />
            <span>Assignments</span>
          </Link>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden flex flex-col items-center space-y-4 mt-4">
          {/* Dashboard Link */}
          <Link
            href="/"
            className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${
              pathname === "/" ? "bg-teal-500" : "hover:bg-teal-500"
            }`}
          >
            <FaTachometerAlt className="text-xl" />
            <span>Dashboard</span>
          </Link>

          {/* Partners Link */}
          <Link
            href="/partners"
            className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${
              pathname === "/partners" ? "bg-teal-500" : "hover:bg-teal-500"
            }`}
          >
            <FaUsers className="text-xl" />
            <span>Partners</span>
          </Link>

          {/* Orders Link */}
          <Link
            href="/orders"
            className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${
              pathname === "/orders" ? "bg-teal-500" : "hover:bg-teal-500"
            }`}
          >
            <FaBoxes className="text-xl" />
            <span>Orders</span>
          </Link>

          {/* Assignments Link */}
          <Link
            href="/assignments"
            className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${
              pathname === "/assignments" ? "bg-teal-500" : "hover:bg-teal-500"
            }`}
          >
            <FaTasks className="text-xl" />
            <span>Assignments</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
