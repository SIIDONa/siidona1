"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/ImageUpload";
import { translations } from "@/lib/translations";
import { useLanguage } from "@/lib/language-context";

interface Category {
  id: number;
  name: string;
}

export default function NewAdForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const { language } = useLanguage();
  const t = (key: string) => {
    const langKey = language as "en" | "am" | "ar";
    return translations[langKey]?.[key as keyof typeof translations.en] || translations.en[key as keyof typeof translations.en] || key;
  };

  const [imageUrl, setImageUrl] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);

  async function createAd(formData: FormData) {
    setUploading(true);
    try {
      // If there's a URL input, use it; otherwise use uploaded image URL
      const finalImageUrl = urlInput || imageUrl;
      if (finalImageUrl) {
        formData.set("imageUrl", finalImageUrl);
      }

      const response = await fetch("/api/ads", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to create ad");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error creating ad:", error);
      alert("Failed to create ad");
    } finally {
      setUploading(false);
    }
  }

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    setUrlInput("");
  };

  const handleUrlInputChange = (value: string) => {
    setUrlInput(value);
    if (value) {
      setImageUrl("");
    }
  };

  return (
    <form action={createAd} className="space-y-5 sm:space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1 sm:mb-2">
          {t("title")} *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-yellow-200 dark:border-yellow-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          placeholder="e.g., iPhone 13 Pro Max"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1 sm:mb-2">
          {t("description")} *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-yellow-200 dark:border-yellow-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          placeholder="Describe your item..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1 sm:mb-2">
            {t("price")} *
          </label>
          <input
            id="price"
            name="price"
            type="text"
            required
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-yellow-200 dark:border-yellow-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            placeholder="e.g., $500"
          />
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1 sm:mb-2">
            {t("category")} *
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-yellow-200 dark:border-yellow-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            <option value="">{t("selectCategory")}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1 sm:mb-2">
          Location
        </label>
        <input
          id="location"
          name="location"
          type="text"
          className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-yellow-200 dark:border-yellow-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          placeholder="e.g., Addis Ababa, Ethiopia"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label htmlFor="contactPhone" className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1 sm:mb-2">
            {t("contactPhone")}
          </label>
          <input
            id="contactPhone"
            name="contactPhone"
            type="tel"
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-yellow-200 dark:border-yellow-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            placeholder="e.g., +251 91 234 5678"
          />
        </div>

        <div>
          <label htmlFor="contactEmail" className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1 sm:mb-2">
            {t("contactEmail")}
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-yellow-200 dark:border-yellow-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            placeholder="e.g., email@example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1 sm:mb-2">
          {t("image")}
        </label>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-2 border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 font-medium">
            Upload an image or paste an image URL:
          </p>
          
          {/* Direct Image Upload */}
          <div className="mb-4">
            <ImageUpload onUpload={handleImageUrlChange} currentValue={imageUrl} />
          </div>
          
          <div className="relative flex items-center my-4">
            <div className="flex-grow border-t border-yellow-300 dark:border-yellow-700"></div>
            <span className="flex-shrink-0 mx-4 text-gray-500 dark:text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-yellow-300 dark:border-yellow-700"></div>
          </div>
          
          {/* Image URL Input */}
          <div>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              value={urlInput}
              onChange={(e) => handleUrlInputChange(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-yellow-200 dark:border-yellow-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          type="submit"
          disabled={uploading}
          className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-2 sm:py-3 rounded-lg font-bold text-base sm:text-lg hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? "Submitting..." : t("submitAd")}
        </button>
        <Link
          href="/"
          className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 sm:py-3 rounded-lg font-bold text-base sm:text-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-center transition-colors"
        >
          {t("cancel")}
        </Link>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 text-center bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
        * {t("adReviewNote")}
      </p>
    </form>
  );
}
