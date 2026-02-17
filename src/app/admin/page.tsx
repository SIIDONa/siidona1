import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { ads, users, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";

export default async function AdminPage() {
  try {
    await requireAdmin();
  } catch {
    redirect("/");
  }

  const allAds = await db
    .select({
      id: ads.id,
      title: ads.title,
      status: ads.status,
      price: ads.price,
      createdAt: ads.createdAt,
      userName: users.name,
      categoryName: categories.name,
    })
    .from(ads)
    .leftJoin(users, eq(ads.userId, users.id))
    .leftJoin(categories, eq(ads.categoryId, categories.id))
    .orderBy(desc(ads.createdAt));

  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
  const allCategories = await db.select().from(categories);

  async function approveAd(formData: FormData) {
    "use server";
    await requireAdmin();
    const adId = parseInt(formData.get("adId") as string);
    await db.update(ads).set({ status: "approved" }).where(eq(ads.id, adId));
    redirect("/admin");
  }

  async function rejectAd(formData: FormData) {
    "use server";
    await requireAdmin();
    const adId = parseInt(formData.get("adId") as string);
    await db.update(ads).set({ status: "rejected" }).where(eq(ads.id, adId));
    redirect("/admin");
  }

  async function deleteAd(formData: FormData) {
    "use server";
    await requireAdmin();
    const adId = parseInt(formData.get("adId") as string);
    await db.delete(ads).where(eq(ads.id, adId));
    redirect("/admin");
  }

  async function deleteUser(formData: FormData) {
    "use server";
    await requireAdmin();
    const userId = parseInt(formData.get("userId") as string);
    await db.delete(users).where(eq(users.id, userId));
    redirect("/admin");
  }

  async function addCategory(formData: FormData) {
    "use server";
    await requireAdmin();
    const name = formData.get("name") as string;
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const description = formData.get("description") as string;
    await db.insert(categories).values({ name, slug, description });
    redirect("/admin");
  }

  async function deleteCategory(formData: FormData) {
    "use server";
    await requireAdmin();
    const categoryId = parseInt(formData.get("categoryId") as string);
    await db.delete(categories).where(eq(categories.id, categoryId));
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <Link href="/" className="text-white hover:text-gray-300">
              Back to Site
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ads Management */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Manage Ads</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allAds.map((ad) => (
                  <tr key={ad.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ad.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ad.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ad.categoryName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ad.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          ad.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : ad.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {ad.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      {ad.status === "pending" && (
                        <>
                          <form action={approveAd} className="inline">
                            <input type="hidden" name="adId" value={ad.id} />
                            <button className="text-green-600 hover:text-green-900">
                              Approve
                            </button>
                          </form>
                          <form action={rejectAd} className="inline">
                            <input type="hidden" name="adId" value={ad.id} />
                            <button className="text-red-600 hover:text-red-900">
                              Reject
                            </button>
                          </form>
                        </>
                      )}
                      <form action={deleteAd} className="inline">
                        <input type="hidden" name="adId" value={ad.id} />
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Categories Management */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>
          
          <div className="bg-white rounded-lg shadow p-6 mb-4">
            <h3 className="font-semibold mb-4">Add New Category</h3>
            <form action={addCategory} className="flex gap-4">
              <input
                name="name"
                type="text"
                required
                placeholder="Category name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                name="description"
                type="text"
                placeholder="Description (optional)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allCategories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {category.description || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <form action={deleteCategory} className="inline">
                        <input type="hidden" name="categoryId" value={category.id} />
                        <button className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Users Management */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.role !== "admin" && (
                        <form action={deleteUser} className="inline">
                          <input type="hidden" name="userId" value={user.id} />
                          <button className="text-red-600 hover:text-red-900">
                            Delete
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
