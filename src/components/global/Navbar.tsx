"use client"

import React from "react"
import { Button } from "../ui/button"
import { authClient, useSession } from "@/lib/auth-client"
import { redirect } from "next/navigation"
import Link from "next/link"

const handleClick = () => {
  authClient.signOut()
  redirect("/sign-in")
}

const Navbar = () => {
  const session = useSession()

  const navItems = ["Ecosystem", "Our Approach", "Enabling Excellence", "Workflow", "Insights", "Contact Us"]

  return (
    <div className="sticky top-0 z-50">
      <nav className="bg-gradient-to-r from-gray-900 to-black text-white p-4 shadow-lg">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <Link
            href="/"
            className="text-3xl font-bold mb-4 md:mb-0 hover:text-sea-green transition-colors duration-300"
          >
            Bioverse
          </Link>
          <ul className="flex flex-wrap justify-center md:justify-end space-x-2 md:space-x-4">
            {navItems.map((item) => (
              <li key={item} className="relative group">
                <Link
                  href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                  className="px-3 py-2 text-sm font-medium text-gray-300 transition-colors duration-300 hover:text-white"
                >
                  {item}
                </Link>
                <span className="absolute left-1/2 bottom-0 w-0 h-0.5 bg-sea-green transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
              </li>
            ))}
            <li>
              {session.data?.user.email ? (
                <Button
                  onClick={handleClick}
                  variant="ghost"
                  size="sm"
                  className="bg-red-600 text-white hover:bg-red-700 hover:shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:rotate-1 rounded-md px-4 py-2"
                >
                  Sign Out
                </Button>
              ) : (
                <div className="space-x-2 flex items-center justify-center">
                  <Link href="/sign-in">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-gray-700 text-white hover:bg-gray-600 hover:shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-1 rounded-md px-4 py-2"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button
                      size="sm"
                      className="bg-sea-green text-white hover:bg-sea-green-600 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:rotate-1 rounded-md px-4 py-2"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )
}

export default Navbar

