import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { ads, categories } from "@/db/schema";
import Link from "next/link";
import Footer from "@/components/Footer";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default async function NewAdPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const allCategories = await db.select().from(categories);

  async function createAd(formData: FormData) {
    "use server";

    const session = await getSession();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const location = formData.get("location") as string;
    const contactPhone = formData.get("contactPhone") as string;
    const contactEmail = formData.get("contactEmail") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const categoryId = parseInt(formData.get("categoryId") as string);

    await db.insert(ads).values({
      title,
      description,
      price,
      location: location || null,
      contactPhone: contactPhone || null,
      contactEmail: contactEmail || null,
      imageUrl: imageUrl || null,
      categoryId,
      userId: session.id,
      status: "pending",
    });

    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-yellow-600 to-yellow-500 dark:from-yellow-700 dark:to-yellow-600 shadow-lg">
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5 sm:p-8 border-2 border-yellow-200 dark:border-yellow-800">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800 dark:text-white">
            Post a New Ad
          </h1>

          <form action={createAd} className="space-y-5 sm:space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1 sm:mb-2">
                Title *
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
                Description *
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
                  Price *
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
                  Category *
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-yellow-200 dark:border-yellow-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="">Select a category</option>
                  {allCategories.map((category) => (
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
                  Contact Phone
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
                  Contact Email
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
              <label htmlFor="imageUrl" className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-1 sm:mb-2">
                Image URL
              </label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-yellow-200 dark:border-yellow-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                Paste a link to an image hosted online
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-2 sm:py-3 rounded-lg font-bold text-base sm:text-lg hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-md hover:shadow-lg"
              >
                Submit Ad
              </button>
              <Link
                href="/"
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 sm:py-3 rounded-lg font-bold text-base sm:text-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-center transition-colors"
              >
                Cancel
              </Link>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 text-center bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
              * Your ad will be reviewed by an admin before being published.
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
