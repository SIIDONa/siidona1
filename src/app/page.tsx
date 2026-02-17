import Link from "next/link";
import { db } from "@/db";
import { ads, categories, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();
  
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              siidona1
            </Link>
            <nav className="flex gap-4 items-center">
              {session ? (
                <>
                  <span className="text-gray-700">Hello, {session.name}</span>
                  <Link
                    href="/ads/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Post Ad
                  </Link>
                  {session.role === "admin" && (
                    <Link
                      href="/admin"
                      className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
                    >
                      Admin
                    </Link>
                  )}
                  <form action="/api/auth/logout" method="POST">
                    <button
                      type="submit"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Logout
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to siidona1</h1>
          <p className="text-xl mb-8">Buy and sell anything in your area</p>
          {!session && (
            <Link
              href="/register"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>

      {/* Ads Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Latest Ads</h2>
        
        {allAds.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No ads available yet.</p>
            {session && (
              <Link
                href="/ads/new"
                className="text-blue-600 hover:underline mt-4 inline-block"
              >
                Be the first to post an ad!
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allAds.map((ad) => (
              <Link
                key={ad.id}
                href={`/ads/${ad.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {ad.imageUrl ? (
                    <img
                      src={ad.imageUrl}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{ad.title}</h3>
                    <span className="text-blue-600 font-bold">{ad.price}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {ad.description}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {ad.categoryName}
                    </span>
                    {ad.location && <span>{ad.location}</span>}
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    Posted by {ad.userName}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
