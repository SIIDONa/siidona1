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
      userId: ads.userId,
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

  async function addWalletFunds(formData: FormData) {
    "use server";
    await requireAdmin();
    const userId = parseInt(formData.get("userId") as string);
    const amount = parseFloat(formData.get("amount") as string) * 100; // Convert to cents
    
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (user) {
      await db.update(users).set({ walletBalance: user.walletBalance + amount }).where(eq(users.id, userId));
    }
    redirect("/admin");
  }

  // Format wallet balance from cents to display
  const formatBalance = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-yellow-600 to-yellow-500 dark:from-yellow-700 dark:to-yellow-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>
            <Link href="/" className="text-white hover:text-yellow-200 font-bold transition-colors">
              ← Back to Site
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Wallet Management Section */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white flex items-center gap-2">
            <span className="text-2xl">💰</span> Manage Wallet
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border-2 border-yellow-200 dark:border-yellow-800">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-yellow-200 dark:divide-yellow-800">
                <thead className="bg-yellow-50 dark:bg-yellow-900/30">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-yellow-800 dark:text-yellow-200 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-yellow-800 dark:text-yellow-200 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-yellow-800 dark:text-yellow-200 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-yellow-800 dark:text-yellow-200 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-yellow-800 dark:text-yellow-200 uppercase tracking-wider">
                      Add Funds
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-yellow-200 dark:divide-yellow-800">
                  {allUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-yellow-50 dark:hover:bg-yellow-900/20">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className="font-bold text-gray-800 dark:text-white">{user.name}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                        {user.email}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 sm:px-3 py-1 text-xs rounded-full font-bold ${
                            user.role === "admin"
                              ? "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className="font-bold text-yellow-600 dark:text-yellow-400 text-lg">
                          ${formatBalance(user.walletBalance)}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <form action={addWalletFunds} className="flex gap-2">
                          <input type="hidden" name="userId" value={user.id} />
                          <input
                            type="number"
                            name="amount"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            required
                            className="w-20 sm:w-24 px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-yellow-200 dark:border-yellow-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                          />
                          <button
                            type="submit"
                            className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-sm hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-md"
                          >
                            Add
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Ads Management */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white flex items-center gap-2">
            <span className="text-2xl">📋</span> Manage Ads
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border-2 border-yellow-200 dark:border-yellow-800">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-yellow-200 dark:divide-yellow-800">
                <thead className="bg-yellow-50 dark:bg-yellow-900/30">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-yellow-800 dark:text-yellow-200 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-yellow-800 dark:text-yellow-200 uppercase tracking-wider hidden sm:table-cell">
                      User
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-yellow-800 dark:text-yellow-200 uppercase tracking-wider hidden md:table-cell">
                      Category
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-yellow-800 dark:text-yellow-200 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-yellow-800 dark:text-yellow-200 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-yellow-800 dark:text-yellow-200 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-yellow-200 dark:divide-yellow-800">
                  {allAds.map((ad) => (
                    <tr key={ad.id} className="hover:bg-yellow-50 dark:hover:bg-yellow-900/20">
                      <td className="px-4 sm:px-6 py-4">
                        <span className="font-bold text-gray-800 dark:text-white text-sm sm:text-base line-clamp-1">{ad.title}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300 text-sm hidden sm:table-cell">
                        {ad.userName}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300 text-sm hidden md:table-cell">
                        {ad.categoryName}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                        {ad.price}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 sm:px-3 py-1 text-xs rounded-full font-bold ${
                            ad.status === "approved"
                              ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
                              : ad.status === "rejected"
                              ? "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
                              : "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300"
                          }`}
                        >
                          {ad.status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm space-x-1 sm:space-x-2">
                        {ad.status === "pending" && (
                          <>
                            <form action={approveAd} className="inline">
                              <input type="hidden" name="adId" value={ad.id} />
                              <button className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 font-bold">
                                ✓
                              </button>
                            </form>
                            <form action={rejectAd} className="inline">
                              <input type="hidden" name="adId" value={ad.id} />
                              <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 font-bold">
                                ✗
                              </button>
                            </form>
                          </>
                        )}
                        <form action={deleteAd} className="inline">
                          <input type="hidden" name="adId" value={ad.id} />
                          <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 font-bold">
                            🗑
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Categories Management */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white flex items-center gap-2">
            <span className="text-2xl">📁</span> Manage Categories
          </h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-6 border-2 border-yellow-200 dark:border-yellow-800">
            <h3 className="font-bold mb-3 sm:mb-4 text-gray-800 dark:text-white">Add New Category</h3>
            <form action={addCategory} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <input
                name="name"
                type="text"
                required
                placeholder="Category name"
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border-2 border-yellow-200 dark:border-yellow-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
              <input
                name="description"
                type="text"
                placeholder="Description (optional)"
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border-2 border-yellow-200 dark:border-yellow-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-5 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-md"
              >
                Add
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border-2 border-yellow-200 dark:border-yellow-800">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-yellow-200 dark:divide-yellow-800">
                <thead className="bg-yellow-50 dark:bg-yellow-900/30">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-yellow-800 dark:text-yellow-200 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-yellow-800 dark:text-yellow-200 uppercase tracking-wider hidden sm:table-cell">
                      Slug
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-yellow-800 dark:text-yellow-200 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-yellow-800 dark:text-yellow-200 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-yellow-200 dark:divide-yellow-800">
                  {allCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-yellow-50 dark:hover:bg-yellow-900/20">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap font-bold text-gray-800 dark:text-white">
                        {category.name}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300 text-sm hidden sm:table-cell">
                        {category.slug}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-gray-600 dark:text-gray-300">
                        {category.description || "-"}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <form action={deleteCategory} className="inline">
                          <input type="hidden" name="categoryId" value={category.id} />
                          <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 font-bold">
                            🗑
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Users Management */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 dark:text-white flex items-center gap-2">
            <span className="text-2xl">👥</span> Manage Users
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border-2 border-yellow-200 dark:border-yellow-800">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-yellow-200 dark:divide-yellow-800">
                <thead className="bg-yellow-50 dark:bg-yellow-900/30">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-yellow-800 dark:text-yellow-200 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-yellow-800 dark:text-yellow-200 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-yellow-800 dark:text-yellow-200 uppercase tracking-wider hidden sm:table-cell">
                      Role
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-yellow-800 dark:text-yellow-200 uppercase tracking-wider hidden md:table-cell">
                      Joined
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-bold text-yellow-800 dark:text-yellow-200 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-yellow-200 dark:divide-yellow-800">
                  {allUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-yellow-50 dark:hover:bg-yellow-900/20">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap font-bold text-gray-800 dark:text-white">
                        {user.name}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                        {user.email}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                        <span
                          className={`px-2 sm:px-3 py-1 text-xs rounded-full font-bold ${
                            user.role === "admin"
                              ? "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300 text-sm hidden md:table-cell">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        {user.role !== "admin" && (
                          <form action={deleteUser} className="inline">
                            <input type="hidden" name="userId" value={user.id} />
                            <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 font-bold">
                              🗑
                            </button>
                          </form>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
