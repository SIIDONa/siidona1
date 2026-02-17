import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { ads, categories, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function AdDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            siidona1
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/"
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Back to listings
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <div className="h-96 bg-gray-200 flex items-center justify-center">
                {ad.imageUrl ? (
                  <img
                    src={ad.imageUrl}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-lg">No image available</span>
                )}
              </div>
            </div>

            <div className="md:w-1/2 p-8">
              <div className="mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {ad.categoryName}
                </span>
              </div>

              <h1 className="text-3xl font-bold mb-4">{ad.title}</h1>
              
              <div className="text-3xl font-bold text-blue-600 mb-6">
                {ad.price}
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{ad.description}</p>
                </div>

                {ad.location && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Location</h3>
                    <p className="text-gray-600">{ad.location}</p>
                  </div>
                )}
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-700 mb-3">Contact Seller</h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Name:</span> {ad.userName}
                  </p>
                  {ad.contactPhone && (
                    <p className="text-gray-600">
                      <span className="font-medium">Phone:</span>{" "}
                      <a href={`tel:${ad.contactPhone}`} className="text-blue-600 hover:underline">
                        {ad.contactPhone}
                      </a>
                    </p>
                  )}
                  {ad.contactEmail && (
                    <p className="text-gray-600">
                      <span className="font-medium">Email:</span>{" "}
                      <a href={`mailto:${ad.contactEmail}`} className="text-blue-600 hover:underline">
                        {ad.contactEmail}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                Posted on {ad.createdAt ? new Date(ad.createdAt).toLocaleDateString() : "Unknown"}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
