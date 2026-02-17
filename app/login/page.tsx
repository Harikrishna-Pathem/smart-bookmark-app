"use client";

export const dynamic = "force-dynamic"

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    setLoading(true);

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8 animate-fade-in">
        {/* Title */}
        <h1 className="text-2xl font-semibold text-center mb-2">
          Welcome back 👋
        </h1>
        <p className="text-sm text-black-800 text-center mb-6">
          Sign in to manage your bookmarks in real time
        </p>

        {/* Google Button */}
        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-black-300 rounded-lg py-3 hover:bg-black-50 transition disabled:opacity-60"
        >
          {loading ? (
            <span className="h-5 w-5 border-2 border-black-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          <span className="font-medium">
            {loading ? "Redirecting..." : "Continue with Google"}
          </span>
        </button>

        {/* Footer */}
        <p className="mt-6 text-xs text-center text-black-400">
          No passwords. Secure Google authentication.
        </p>
      </div>
    </div>
  );
}

/* ---------------------------
   Google Icon Component
---------------------------- */

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.23 9.2 3.64l6.85-6.85C35.9 2.5 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.39 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.14-3.09-.4-4.55H24v9.02h12.94c-.56 3.01-2.24 5.56-4.77 7.27l7.73 6.01C44.41 38.52 46.98 32.01 46.98 24.55z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.9-5.81l-7.73-6.01c-2.15 1.45-4.92 2.3-8.17 2.3-6.26 0-11.57-3.89-13.46-9.19l-7.97 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}
