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
    <div className="max-w-md p-6 mx-auto">
      <h1 className="text-xl font-bold">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4">
        <input
          type="email"
          placeholder="Email"
          className="p-2 border rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 border rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit" className="p-2 text-white bg-green-600 rounded">
          Login
        </button>
      </form>
      {msg && <p className="mt-2 text-red-600">{msg}</p>}
    </div>
  );
}
