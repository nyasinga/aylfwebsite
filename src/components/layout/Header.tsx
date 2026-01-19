'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { AYLF_NAVIGATION } from '@/lib/aylf-content'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const navigation = AYLF_NAVIGATION.main

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={ROUTES.HOME} className="flex items-center">
              <span className="text-2xl font-bold text-primary-700 md:text-3xl">
                AYLF
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:space-x-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors rounded-md"
                >
                  {item.name}
                </Link>
                {item.submenu && (
                  <div className="absolute left-0 mt-2 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-white rounded-md shadow-lg border border-gray-100 py-2">
                    {item.submenu.map((subItem, idx) => {
                      if ('category' in subItem) {
                        // Leadership Programs category
                        return (
                          <div key={idx} className="px-4 py-2">
                            <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                              {subItem.category}
                            </div>
                            {subItem.items.map((program) => (
                              <Link
                                key={program.name}
                                href={program.href}
                                className="block px-2 py-1.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded"
                              >
                                {program.name}
                              </Link>
                            ))}
                          </div>
                        )
                      }
                      // Regular menu item
                      return (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                        >
                          {subItem.name}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:flex lg:items-center">
            <Button
              variant="primary"
              size="md"
              href="/donate"
              asChild
              className="bg-primary-600 hover:bg-primary-700"
            >
              Donate Now
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
                {item.submenu && (
                  <div className="pl-4 mt-1 space-y-1">
                    {item.submenu.map((subItem, idx) => {
                      if ('category' in subItem) {
                        return (
                          <div key={idx} className="mb-2">
                            <div className="text-xs font-semibold text-gray-500 uppercase mb-1 px-3">
                              {subItem.category}
                            </div>
                            {subItem.items.map((program) => (
                              <Link
                                key={program.name}
                                href={program.href}
                                className="block px-3 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {program.name}
                              </Link>
                            ))}
                          </div>
                        )
                      }
                      return (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-md"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4">
              <Button
                variant="primary"
                size="md"
                href="/donate"
                className="w-full bg-primary-600 hover:bg-primary-700"
                asChild
              >
                Donate Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
