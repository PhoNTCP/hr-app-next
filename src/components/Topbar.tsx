"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const [userName, setUserName] = useState("Guest");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setUserName(data.user.name || data.user.email))
      .catch(() => router.push("/login"));
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    setUserName("Guest");
    router.push("/");
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 border-b backdrop-blur-xl bg-white/60 dark:bg-neutral-900/70 border-white/30 dark:border-neutral-700/60 text-neutral-900 dark:text-neutral-100">
      <div /> {/* เว้นไว้ถ้ามีโลโก้/ปุ่มอื่นในอนาคต */}
      <div className="flex items-center gap-4">
        <span className="font-medium">{userName}</span>
        <button
          onClick={handleLogout}
          className="px-3 py-1 text-white shadow-lg rounded-xl bg-red-500/90 hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
