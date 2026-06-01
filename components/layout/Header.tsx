"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LogoutButton from "@/components/auth/LogoutButton";
import { createClient } from "@/lib/supabase/browser";

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log("USER:", user);

      if (!user) return;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      console.log("PROFILE:", profile);
      console.log("PROFILE ERROR:", error);

      setIsAdmin(profile?.role === "admin");
    }

    checkAdmin();
  }, []);

  return (
    <header className="site-header">
      <div className="container">
        <nav aria-label="Navegación principal">
          <ul className="nav-list">
            <li><Link href="/">Inicio</Link></li>
            <li><Link href="/auth">Auth</Link></li>
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><Link href="/wardrobe">Mi armario</Link></li>
            <li><Link href="/feed">Feed</Link></li>
            <li><Link href="/matches">Matches</Link></li>
            <li><Link href="/heritage">Heritage</Link></li>

            {isAdmin && (
              <li>
                <Link href="/admin">Admin Core</Link>
              </li>
            )}

            <li><LogoutButton /></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}