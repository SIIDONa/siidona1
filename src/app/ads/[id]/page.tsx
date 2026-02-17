import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "@/db";
import { ads, categories, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import Footer from "@/components/Footer";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { translations } from "@/lib/translations";

// Server-side translation function
function getTranslation(lang: string, key: string): string {
  const langKey = lang as "en" | "am" | "ar";
  return translations[langKey]?.[key as keyof typeof translations.en] || translations.en[key as keyof typeof translations.en] || key;
}

export default async function AdDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // Get language from cookie
  const cookieStore = await cookies();
  const lang = cookieStore.get("language")?.value || "en";
  const t = (key: string) => getTranslation(lang, key);
  
  const [ad] = await db
    .select({
      id: ads.id,
      title: ads.title,
      description: ads.description,
      price: ads.price,
      location: ads.location,
      contactPhone: ads.contactPhone,
      contactEmail: ads.contactEmail,
      imageUrl: ads.imageUrl,
      createdAt: ads.createdAt,
      status: ads.status,
      categoryName: categories.name,
      userName: users.name,
      userEmail: users.email,
    })
    .from(ads)
    .leftJoin(categories, eq(ads.categoryId, categories.id))
    .leftJoin(users, eq(ads.userId, users.id))
    .where(eq(ads.id, parseInt(id)));

  if (!ad || ad.status !== "approved") {
    notFound();
  }

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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 font-bold mb-4 sm:mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t("backToListings")}
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border-2 border-yellow-200 dark:border-yellow-800">
          <div className="md:flex">
            <div className="md:w-1/2">
              <div className="h-64 sm:h-80 md:h-96 bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center overflow-hidden">
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
            </div>

            <div className="md:w-1/2 p-5 sm:p-8">
              <div className="mb-4">
                <span className="bg-white dark:bg-gray-700 border-2 border-yellow-500 text-yellow-600 dark:text-yellow-400 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm font-bold">
                  {ad.categoryName}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-800 dark:text-white">
                {ad.title}
              </h1>
              
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-5 sm:mb-6">
                {ad.price}
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-2">Description</h3>
                  <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{ad.description}</p>
                </div>

                {ad.location && (
                  <div>
                    <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-1">Location</h3>
                    <p className="text-gray-600 dark:text-gray-300">{ad.location}</p>
                  </div>
                )}
              </div>

              <div className="border-t-2 border-yellow-200 dark:border-yellow-800 pt-5 sm:pt-6">
                <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-3 sm:mb-4 text-lg">
                  {t("contactSeller")}
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-bold">Name:</span> {ad.userName}
                  </p>
                  {ad.contactPhone && (
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-bold">Phone:</span>{" "}
                      <a href={`tel:${ad.contactPhone}`} className="text-yellow-600 dark:text-yellow-400 hover:underline font-medium">
                        {ad.contactPhone}
                      </a>
                    </p>
                  )}
                  {ad.contactEmail && (
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-bold">Email:</span>{" "}
                      <a href={`mailto:${ad.contactEmail}`} className="text-yellow-600 dark:text-yellow-400 hover:underline font-medium">
                        {ad.contactEmail}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 sm:mt-6 text-sm text-gray-500 dark:text-gray-400">
                {t("postedBy")} {ad.userName || ad.userEmail} | {ad.createdAt ? new Date(ad.createdAt).toLocaleDateString() : "Unknown"}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
