"use client";

import { useEffect, useState } from "react";
import AddUserModal from "@/components/AddUserModal";
import { useRouter } from "next/navigation";

export default function UserTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [editUser, setEditUser] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
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
      .then((data) => data && setUsers(data))
      .catch((err) => setError(err));
  }, [router]);

  // ฟังก์ชันแก้ไข
  const handleEdit = (user: any) => {
    setEditUser(user);   // ส่งค่าเดิมไป
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/init-users?id=${id}`, {
      method: "DELETE",
    });
    location.reload();
  };

  return (
    <div>
      <table className="w-full border border-collapse border-gray-300 table-auto">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">No</th>
            <th className="p-2 border">National ID</th>
            <th className="p-2 border">Code</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Surname</th>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Registered</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={u.id} className="hover:bg-gray-100">
              <td className="p-2 text-center border">{i + 1}</td>
              <td className="p-2 border">{u.thaiId}</td>
              <td className="p-2 border">{u.code}</td>
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.surname}</td>
              <td className="p-2 border">{u.title}</td>
              <td className="p-2 text-center border">
                {u.lineId ? "✅" : "❌"}
              </td>
              <td className="flex gap-2 p-2 border">
                <button
                  onClick={() => handleEdit(u)}
                  className="px-2 py-1 text-white bg-blue-500 rounded"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="px-2 py-1 text-white bg-red-500 rounded"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 👇 Render modal แค่ครั้งเดียว */}
      {showModal && (
        <AddUserModal
          onClose={() => setShowModal(false)}
          initialData={editUser}
        />
      )}
    </div>
  );
}
