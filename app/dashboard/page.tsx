"use client";

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";

const supabase = getSupabaseClient();


type Bookmark = {
  id: string;
  title: string;
  url: string;
  created_at: string;
};

export default function Dashboard() {
  const router = useRouter();

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  // -----------------------------
  // Auth Guard (IMPORTANT)
  // -----------------------------
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      setCheckingAuth(false);
    };

    checkAuth();
  }, [router]);

  // -----------------------------
  // Fetch bookmarks + realtime
  // -----------------------------
  useEffect(() => {
    if (checkingAuth) return;

    fetchBookmarks();

    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        () => fetchBookmarks()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [checkingAuth]);

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
    setPageLoading(false);
  };

  // -----------------------------
  // Add bookmark (optimistic)
  // -----------------------------
  const addBookmark = async () => {
    if (!title || !url) return;

    setAdding(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("bookmarks")
      .insert({
        title,
        url,
        user_id: user.id,
      })
      .select()
      .single();

    if (data) {
      setBookmarks((prev) => [data, ...prev]);
      setTitle("");
      setUrl("");
    }

    setAdding(false);
  };

  // -----------------------------
  // Delete bookmark
  // -----------------------------
  const deleteBookmark = async (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  // -----------------------------
  // Logout
  // -----------------------------
  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  // -----------------------------
  // Prevent UI flash
  // -----------------------------
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="h-6 w-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-xl font-semibold">🔖 Smart Bookmarks</h1>
          <button
            onClick={logout}
            className="text-sm text-red-600 hover:text-red-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto p-6">
        {/* Add Bookmark */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 animate-fade-in">
          <h2 className="text-lg font-medium mb-4">Add Bookmark</h2>

          <div className="grid sm:grid-cols-2 gap-3">
            <input
              className="border rounded-lg p-3"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="border rounded-lg p-3"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <button
            onClick={addBookmark}
            disabled={adding}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {adding ? "Adding..." : "Add Bookmark"}
          </button>
        </div>

        {/* Bookmark List */}
        {pageLoading ? (
          <SkeletonList />
        ) : bookmarks.length === 0 ? (
          <p className="text-center text-gray-500">
            No bookmarks yet. Add your first one 🚀
          </p>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center animate-slide-up"
              >
                <div>
                  <a
                    href={b.url}
                    target="_blank"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {b.title}
                  </a>
                  <p className="text-sm text-gray-400">
                    {new Date(b.created_at).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => deleteBookmark(b.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

/* -----------------------------
   Skeleton Loader
----------------------------- */

function SkeletonList() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-sm p-4 animate-pulse"
        >
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-1/3" />
        </div>
      ))}
    </div>
  );
}
