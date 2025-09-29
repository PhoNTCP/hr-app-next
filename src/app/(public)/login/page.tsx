"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      // login success → redirect ไป Home
      router.push("/home");
      // window.location.reload();
    } else {
      const data = await res.json();
      setMsg(data.error || "Login failed");
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-400/25 to-emerald-400/25">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 space-y-4 border shadow-lg backdrop-blur-xl bg-white/70 border-white/40 rounded-2xl"
      >
        <h2 className="text-2xl font-bold text-center text-neutral-900">Login</h2>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-xl border-neutral-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-xl border-neutral-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          className="w-full py-2 font-semibold text-white bg-indigo-500 rounded-xl hover:bg-indigo-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}
