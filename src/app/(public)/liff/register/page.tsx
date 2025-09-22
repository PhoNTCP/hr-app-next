"use client";
import { useEffect, useState } from "react";
import liff from "@line/liff";

export default function LiffRegisterPage() {
  const [ready, setReady] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [thaiId, setThaiId] = useState("");

  useEffect(() => {
    (async () => {
      try {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });
        if (!liff.isLoggedIn()) {
          liff.login({ redirectUri: window.location.href });
          return;
        }
        const profile = await liff.getProfile();
        setDisplayName(profile.displayName);
        setReady(true);
      } catch (e) {
        alert("LIFF init failed");
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const idToken = liff.getIDToken(); // ต้องเปิด OpenID Connect scope ใน Login channel
    if (!idToken) {
      alert("ไม่พบ idToken กรุณา login ใหม่ใน LIFF");
      return;
    }

    const res = await fetch("/api/line/bind", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ thaiId, idToken }), // ✅ ส่ง idToken ตามมาตรฐาน
    });

    const data = await res.json();
    if (res.ok) {
      alert("ผูกบัญชีสำเร็จ!");
      if (liff.isInClient()) liff.closeWindow();
    } else {
      alert(data.error || "ผูกบัญชีไม่สำเร็จ!!!!!");
    }
  };

  if (!ready) return <div className="p-6">กำลังโหลด...</div>;

  return (
    <div className="max-w-md p-6 mx-auto bg-white rounded shadow">
      <h1 className="mb-2 text-xl font-bold">ผูกบัญชี LINE</h1>
      <p className="mb-4">สวัสดี {displayName}</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block">
          <span className="text-sm">Thai ID (หรือข้อมูลยืนยันตัวตน)</span>
          <input
            className="w-full p-2 border rounded"
            value={thaiId}
            onChange={(e) => setThaiId(e.target.value)}
            placeholder="เช่น 1234567890123"
            required
          />
        </label>

        <button
          type="submit"
          className="w-full p-2 text-white bg-green-600 rounded hover:bg-green-700"
        >
          ผูกบัญชี
        </button>
      </form>
    </div>
  );
}
