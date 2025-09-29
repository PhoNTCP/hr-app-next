"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/home", { credentials: "include" })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          router.push("/login"); // 👈 redirect ไปหน้า login
          return null;
        }
        return res.json();
      })
      .then(setData);
  }, []);

  if (!data) return <p>Loading...</p>;

  const { stats, visits } = data;

  return (
    <div className="p-6">
      {/* Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 space-y-4 glass-card">
          <h2 className="text-gray-600">จำนวน User ที่รอลงทะเบียน</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.pending}</p>
        </div>
        <div className="p-4 space-y-4 glass-card">
          <h2 className="text-gray-600">ลงทะเบียนแล้ว</h2>
          <p className="text-3xl font-bold text-green-600">{stats.registered}</p>
        </div>
        <div className="p-4 space-y-4 glass-card">
          <h2 className="text-gray-600">จำนวนทั้งหมด</h2>
          <p className="text-3xl font-bold text-purple-600">{stats.total}</p>
        </div>
      </div>

    </div>
  );
}
