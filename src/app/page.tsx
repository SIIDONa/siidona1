import Link from "next/link";
import { cookies } from "next/headers";
import { db } from "@/db";
import { ads, categories, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import Footer from "@/components/Footer";
import { translations } from "@/lib/translations";

// Server-side translation function
function getTranslation(lang: string, key: string): string {
  const langKey = lang as "en" | "am" | "ar";
  return translations[langKey]?.[key as keyof typeof translations.en] || translations.en[key as keyof typeof translations.en] || key;
}

export default async function Home() {
  const session = await getSession();
  
  // Get language from cookie
  const cookieStore = await cookies();
  const lang = cookieStore.get("language")?.value || "en";
  const t = (key: string) => getTranslation(lang, key);
  
  // Get all approved ads with category and user info
  const allAds = await db
    .select({
      id: ads.id,
      title: ads.title,
      description: ads.description,
      price: ads.price,
      location: ads.location,
      imageUrl: ads.imageUrl,
      createdAt: ads.createdAt,
      categoryName: categories.name,
      userName: users.name,
    })
    .from(ads)
    .leftJoin(categories, eq(ads.categoryId, categories.id))
    .leftJoin(users, eq(ads.userId, users.id))
    .where(eq(ads.status, "approved"))
    .orderBy(desc(ads.createdAt));

  // Get categories for filter
  const allCategories = await db.select().from(categories);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg border-b-2 border-yellow-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            <Link href="/" className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">
              siidona1
            </Link>
            <nav className="flex flex-wrap justify-center gap-2 sm:gap-4 items-center">
              {session ? (
                <>
                  <span className="text-yellow-100 text-sm sm:text-base font-medium">Hello, {session.name}</span>
                  <Link
                    href="/ads/new"
                    className="bg-white text-yellow-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold hover:bg-yellow-50 transition-colors text-sm sm:text-base shadow-md"
                  >
                    {t("postAd")}
                  </Link>
                  {session.role === "admin" && (
                    <Link
                      href="/admin"
                      className="bg-yellow-800 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-yellow-900 transition-colors text-sm sm:text-base font-medium"
                    >
                      {t("admin")}
                    </Link>
                  )}
                  <form action="/api/auth/logout" method="POST">
                    <button
                      type="submit"
                      className="text-white hover:text-yellow-200 font-medium text-sm sm:text-base"
                    >
                      {t("logout")}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-white hover:text-yellow-200 font-medium text-sm sm:text-base"
                  >
                    {t("login")}
                  </Link>
                  <Link
                    href="/register"
                    className="bg-white text-yellow-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold hover:bg-yellow-50 transition-colors text-sm sm:text-base shadow-md"
                  >
                    {t("register")}
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 border-b-2 border-yellow-500 text-gray-800 dark:text-white py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 drop-shadow-lg">
            {t("welcomeTitle")}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-gray-600 dark:text-gray-300">
            {t("welcomeSubtitle")}
          </p>
          {!session && (
            <Link
              href="/register"
              className="inline-block border-2 border-yellow-500 text-yellow-600 dark:text-yellow-400 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-lg sm:text-xl hover:bg-yellow-50 dark:hover:bg-yellow-900/30 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              {t("getStarted")}
            </Link>
          )}
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-yellow-500 dark:border-yellow-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 overflow-x-auto">
          <div className="flex gap-2 sm:gap-4 min-w-max">
            <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-yellow-500 text-white rounded-full font-bold text-sm sm:text-base shadow-md">
              All
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat.id}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white dark:bg-gray-700 border-2 border-yellow-500 text-yellow-600 dark:text-yellow-400 rounded-full font-medium text-sm sm:text-base hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ads Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white">
          {t("latestAds")}
        </h2>
        
        {allAds.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="text-6xl sm:text-8xl mb-4">📦</div>
            <p className="text-gray-500 text-lg sm:text-xl mb-4">{t("noAds")}</p>
            {session && (
              <Link
                href="/ads/new"
                className="text-yellow-600 hover:text-yellow-700 font-bold text-lg"
              >
                {t("beFirst")}
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {allAds.map((ad) => (
              <Link
                key={ad.id}
                href={`/ads/${ad.id}`}
                className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:border-yellow-500 dark:hover:border-yellow-500 border-2 border-gray-200 dark:border-gray-600 transition-all transform hover:-translate-y-1"
              >
                <div className="h-40 sm:h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  {ad.imageUrl ? (
                    <img
                      src={ad.imageUrl}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src="/placeholder.svg"
                      alt="No image"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-3 sm:p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-base sm:text-lg text-gray-800 dark:text-white line-clamp-1">{ad.title}</h3>
                  </div>
                  <p className="text-yellow-600 dark:text-yellow-400 font-bold text-lg sm:text-xl mb-2">
                    {ad.price}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">
                    {ad.description}
                  </p>
                  <div className="flex flex-wrap justify-between items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 gap-1">
                    <span className="bg-white dark:bg-gray-700 border-2 border-yellow-500 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded-full font-medium">
                      {ad.categoryName}
                    </span>
                    {ad.location && <span className="truncate max-w-[100px]">{ad.location}</span>}
                  </div>
                  <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                    Posted by {ad.userName}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
