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

  setUserName("Guest"); // reset ชื่อ user
  router.push("/"); // redirect
};

  return (
    <div className="flex items-center justify-between px-6 py-3 text-white bg-blue-600">
      <div />
      <div className="flex items-center gap-4">
        <span>{userName}</span>
        <button onClick={handleLogout} className="px-3 py-1 bg-red-600 rounded">
          Logout
        </button>
      </div>
    </div>
  );
}
