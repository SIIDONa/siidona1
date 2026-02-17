import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { categories } from "@/db/schema";
import Link from "next/link";
import Footer from "@/components/Footer";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import NewAdForm from "@/components/NewAdForm";
import { translations } from "@/lib/translations";

// Server-side translation function
function getTranslation(lang: string, key: string): string {
  const langKey = lang as "en" | "am" | "ar";
  return translations[langKey]?.[key as keyof typeof translations.en] || translations.en[key as keyof typeof translations.en] || key;
}

export default async function NewAdPage() {
  const session = await getSession();
  
  // Get language from cookie
  const cookieStore = await cookies();
  const lang = cookieStore.get("language")?.value || "en";
  const t = (key: string) => getTranslation(lang, key);

  if (!session) {
    redirect("/login");
  }

  const allCategories = await db.select().from(categories);

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
            {t("postAdTitle")}
          </h1>

          <NewAdForm categories={allCategories} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
