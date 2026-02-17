"use client";

import { useLanguage } from "@/lib/language-context";
import { Language } from "@/lib/translations";

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "am", label: "አማርኛ", flag: "🇪🇹" },
    { code: "ar", label: "العربية", flag: "🇸🇦" },
  ];

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700 text-white px-3 py-1.5 rounded-lg font-bold text-sm hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-md"
        aria-label="Select language"
      >
        <span className="text-lg">{languages.find((l) => l.code === language)?.flag}</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 border border-yellow-200 dark:border-yellow-700">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-yellow-50 dark:hover:bg-yellow-900/30 transition-colors first:rounded-t-lg last:rounded-b-lg ${
              language === lang.code
                ? "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 font-bold"
                : "text-gray-700 dark:text-gray-200"
            }`}
          >
            <span className="text-xl">{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
