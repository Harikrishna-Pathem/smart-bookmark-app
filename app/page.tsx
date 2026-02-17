"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      const result = await supabase.auth.getSession();

      const session = result.data?.session;

      if (session) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    };

    handleAuth();
  }, [router]);

  return null;
}
