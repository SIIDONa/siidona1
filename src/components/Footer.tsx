"use client";

import { useState, useEffect } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import Link from "next/link";

export default function Footer() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return savedTheme === "dark" || (!savedTheme && prefersDark);
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <footer className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 dark:from-yellow-800 dark:via-yellow-700 dark:to-yellow-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* About Section */}
          <div className="lg:col-span-1">
            <h3 className="text-xl md:text-2xl font-bold mb-4">siidona1</h3>
            <p className="text-yellow-100 dark:text-yellow-200 text-sm md:text-base">
              Ethiopia&apos;s premier classified ads platform. Buy, sell, and discover amazing deals in your area.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">Categories</h3>
            <ul className="space-y-2 text-yellow-100 dark:text-yellow-200 text-sm md:text-base">
              <li className="hover:text-white cursor-pointer transition-colors">Electronics</li>
              <li className="hover:text-white cursor-pointer transition-colors">Vehicles</li>
              <li className="hover:text-white cursor-pointer transition-colors">Real Estate</li>
              <li className="hover:text-white cursor-pointer transition-colors">Furniture</li>
              <li className="hover:text-white cursor-pointer transition-colors">Fashion</li>
              <li className="hover:text-white cursor-pointer transition-colors">Services</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-yellow-100 dark:text-yellow-200 text-sm md:text-base">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">Login</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">Register</Link>
              </li>
              <li>
                <Link href="/ads/new" className="hover:text-white transition-colors">Post Ad</Link>
              </li>
            </ul>
          </div>

          {/* Social Media & Settings */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex gap-3 md:gap-4 mb-4">
              <a
                href="https://youtube.com/@melakushow"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform bg-red-600 p-2 rounded-lg"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="https://tiktok.com/@melakushow"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform bg-black p-2 rounded-lg"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com/melakushow"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform bg-blue-600 p-2 rounded-lg"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://t.me/melakushow"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform bg-blue-500 p-2 rounded-lg"
                aria-label="Telegram"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
            
            {/* Theme Toggle & Language Switcher */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 bg-yellow-700 dark:bg-yellow-800 px-3 py-2 rounded-lg hover:bg-yellow-800 dark:hover:bg-yellow-900 transition-colors text-sm font-bold"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                    </svg>
                    <span className="hidden sm:inline">Light</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                    <span className="hidden sm:inline">Dark</span>
                  </>
                )}
              </button>
              
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-yellow-400 dark:border-yellow-600 mt-6 md:mt-8 pt-6 text-center">
          <p className="text-base md:text-lg font-bold">
            © 2026 Siidona Network. All rights reserved.
          </p>
          <p className="text-yellow-100 dark:text-yellow-200 mt-2 text-sm md:text-base">
            Made with ❤️ in Ethiopia
          </p>
        </div>
      </div>
    </footer>
  );
}
