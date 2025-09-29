"use client";

import { useEffect, useMemo, useState } from "react";
import AddUserModal from "@/components/AddUserModal";
import { useRouter } from "next/navigation";

export default function UserTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [editUser, setEditUser] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  // UI state
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const router = useRouter();

  // โหลดข้อมูล
  useEffect(() => {
    fetch("/api/init-users")
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          router.push("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => data && setUsers(Array.isArray(data) ? data : []))
      .catch((err) => setError(String(err)));
  }, [router]);

  // filter
  const filtered = useMemo(() => {
    if (!q.trim()) return users;
    const v = q.toLowerCase();
    return users.filter((u) =>
      [u.thaiId, u.code, u.name, u.surname, u.title]
        .join(" ")
        .toLowerCase()
        .includes(v)
    );
  }, [q, users]);

  const pageCount = Math.max(1, Math.ceil((filtered?.length ?? 0) / pageSize));
  const current = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // ฟังก์ชันแก้ไข/ลบ
  const handleEdit = (user: any) => {
    setEditUser(user);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/init-users?id=${id}`, { method: "DELETE" });
    const res = await fetch("/api/init-users");
    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
  };

  return (
    <div className="w-full p-4 border shadow-lg md:p-6 rounded-2xl border-white/40 bg-white/70 backdrop-blur-xl">
      {/* toolbar */}
      <div className="flex flex-col gap-3 mb-3 md:flex-row md:items-center md:justify-between">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Search..."
          className="w-full max-w-xl px-4 py-2 border rounded-xl border-neutral-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <div className="flex items-center gap-2 text-sm">
          <span>Rows:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="w-24 px-2 py-2 border rounded-xl border-neutral-300 focus:outline-none"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table for md+ screens */}
      <div className="hidden overflow-auto border md:block rounded-2xl border-white/40">
        <table className="w-full text-left">
          <thead className="bg-white/60">
            <tr className="[&>th]:px-3 [&>th]:py-2 text-sm text-neutral-600">
              <th>No</th>
              <th>National ID</th>
              <th>Code</th>
              <th>Name</th>
              <th>Surname</th>
              <th>Title</th>
              <th className="text-center">Registered</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white/50">
            {current.map((u, i) => (
              <tr
                key={u.id}
                className="transition-colors odd:bg-white/50 even:bg-white/40 hover:bg-white/70"
              >
                <td className="px-3 py-2">{(page - 1) * pageSize + i + 1}</td>
                <td className="px-3 py-2">{u.thaiId}</td>
                <td className="px-3 py-2">{u.code}</td>
                <td className="px-3 py-2">{u.name}</td>
                <td className="px-3 py-2">{u.surname}</td>
                <td className="px-3 py-2">{u.title}</td>
                <td className="px-3 py-2 text-center">
                  {u.lineId ? "✅" : "❌"}
                </td>
                <td className="px-3 py-2">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(u)}
                      className="px-3 py-1 text-white bg-indigo-500 rounded-xl hover:bg-indigo-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="px-3 py-1 text-white rounded-xl bg-rose-500 hover:bg-rose-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {current.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-neutral-500">
                  No data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card layout for small screens */}
      <div className="space-y-3 md:hidden">
        {current.map((u, i) => (
          <div
            key={u.id}
            className="p-4 border shadow rounded-xl border-white/40 bg-white/60"
          >
            <div className="flex justify-between mb-2">
              <span className="font-semibold">
                #{(page - 1) * pageSize + i + 1} — {u.name} {u.surname}
              </span>
              <span>{u.lineId ? "✅" : "❌"}</span>
            </div>
            <div className="text-sm text-neutral-600">
              <p>
                <b>ID:</b> {u.thaiId}
              </p>
              <p>
                <b>Code:</b> {u.code}
              </p>
              <p>
                <b>Title:</b> {u.title}
              </p>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(u)}
                className="flex-1 py-1 text-white bg-indigo-500 rounded-lg"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(u.id)}
                className="flex-1 py-1 text-white rounded-lg bg-rose-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* pagination */}
      <div className="flex flex-col items-center justify-between gap-3 mt-4 md:flex-row">
        <div className="text-sm text-neutral-600">
          Showing <b>{current.length}</b> of <b>{filtered.length}</b> (total{" "}
          <b>{users.length}</b>)
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 bg-white border rounded-xl"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          {Array.from({ length: pageCount }, (_, i) => i + 1)
            .slice(Math.max(0, page - 3), Math.min(pageCount, page + 2))
            .map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded-xl border ${
                  p === page ? "bg-neutral-900 text-white" : "bg-white/70"
                }`}
              >
                {p}
              </button>
            ))}
          <button
            className="px-3 py-1 bg-white border rounded-xl"
            disabled={page >= pageCount}
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal edit */}
      {showModal && (
        <AddUserModal
          onClose={() => setShowModal(false)}
          initialData={editUser}
        />
      )}

      {error && (
        <div className="mt-3 text-sm text-rose-600">
          {error}
        </div>
      )}
    </div>
  );
}
