"use client"

import { Button } from "../ui/button"
// import { authClient } from "@/lib/auth-client"
// import { redirect } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ModeToggle } from "../mode-toggle"
import Image from "next/image"
import { useState } from "react"
import { IoMenu, IoClose } from "react-icons/io5"

const Navbar = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = ["Ecosystem", "Our Approach", "Enabling Excellence", "Workflow", "Insights", "Contact Us"]

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-black via-gray-900 to-black border-b border-sea-green/30 backdrop-blur-sm">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link href="/" className="relative z-10">
          <Image
            src="/logo.png"
            alt="Bioverse Logo"
            width={160}
            height={50}
            className="cursor-pointer hover:opacity-90 transition-opacity"
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => {
            const isActive = pathname === `/${item.toLowerCase().replace(/ /g, "-")}`

            return (
              <li key={item} className="relative group">
                <Link
                  href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                  className={`px-3 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive ? "text-sea-green" : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-sea-green transform origin-left transition-transform duration-300 ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/sign-in">
              <Button
                variant="ghost"
                size="sm"
                className="bg-gray-800/50 text-white hover:bg-gray-700 hover:text-sea-green transition-all duration-300 rounded-lg px-4 py-2 backdrop-blur-sm"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button
                size="sm"
                className="bg-sea-green text-white hover:bg-sea-green/80 transition-all duration-300 rounded-lg px-4 py-2 shadow-lg shadow-sea-green/20"
              >
                Sign Up
              </Button>
            </Link>
            <div className="pl-2 border-l border-gray-700">
              <ModeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <IoClose className="w-6 h-6" /> : <IoMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 bg-black/95 backdrop-blur-sm transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ top: "3.75rem" }}
      >
        <div className="flex flex-col p-6 space-y-6">
          {navItems.map((item) => {
            const isActive = pathname === `/${item.toLowerCase().replace(/ /g, "-")}`

            return (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                className={`text-lg font-medium transition-all duration-300 ${
                  isActive ? "text-sea-green" : "text-gray-300 hover:text-white"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            )
          })}
          <div className="pt-6 space-y-4 border-t border-gray-800">
            <Link href="/sign-in" className="block">
              <Button
                variant="ghost"
                className="w-full bg-gray-800/50 text-white hover:bg-gray-700 hover:text-sea-green transition-all duration-300 rounded-lg py-2"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up" className="block">
              <Button className="w-full bg-sea-green text-white hover:bg-sea-green/80 transition-all duration-300 rounded-lg py-2 shadow-lg shadow-sea-green/20">
                Sign Up
              </Button>
            </Link>
            <div className="flex justify-center pt-4">
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

