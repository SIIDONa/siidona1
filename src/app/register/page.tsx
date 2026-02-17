"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/lib/language-context";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg border-b-2 border-yellow-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">
              siidona1
            </Link>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-6 sm:py-8">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border-2 border-yellow-200 dark:border-yellow-800">
            <div className="text-center mb-6 sm:mb-8">
              <Link href="/" className="text-3xl sm:text-4xl font-bold text-yellow-600 dark:text-yellow-400">
                siidona1
              </Link>
              <h2 className="mt-4 text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                {t("registerTitle")}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 sm:p-4 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1 sm:mb-2">
                  {t("name")}
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-yellow-200 dark:border-yellow-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1 sm:mb-2">
                  {t("email")}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-yellow-200 dark:border-yellow-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1 sm:mb-2">
                  {t("password")}
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-yellow-200 dark:border-yellow-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="••••••••"
                />
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">At least 6 characters</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-2 sm:py-3 rounded-lg font-bold text-base sm:text-lg hover:from-yellow-600 hover:to-yellow-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {loading ? (t("register") + "...") : t("registerButton")}
              </button>
            </form>

            <p className="mt-6 sm:mt-8 text-center text-sm sm:text-base text-gray-600 dark:text-gray-300">
              {t("haveAccount")}{" "}
              <Link href="/login" className="text-yellow-600 dark:text-yellow-400 font-bold hover:underline">
                {t("loginHere")}
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
