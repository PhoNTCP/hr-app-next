"use client";

import { useState } from "react";
import UserTable from "@/components/UserTable";
import AddUserModal from "@/components/AddUserModal";
import UploadUserModal from "@/components/UploadUserModal";

export default function UserPage() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);

  const handleExport = async () => {
    const res = await fetch("/api/init-users/excel");
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    const rightNow = new Date();
    const fileName = rightNow.toISOString().slice(0, 10).replace(/-/g, "");
    a.download = `users_${fileName}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>

        <div className="flex gap-2">
          <button
            onClick={() => setOpenUpload(true)}
            className="px-4 py-2 text-white shadow-lg rounded-xl bg-emerald-500/90 hover:bg-emerald-600"
          >
            Import
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 text-white shadow-lg rounded-xl bg-indigo-500/90 hover:bg-indigo-600"
          >
            Export
          </button>
          <button
            onClick={() => setOpenAdd(true)}
            className="px-4 py-2 text-white shadow-lg rounded-xl bg-neutral-900 hover:bg-neutral-800"
          >
            + New
          </button>
        </div>
      </div>

      {/* ตาราง (มี search + paging) */}
      <UserTable />

      {openAdd && <AddUserModal onClose={() => setOpenAdd(false)} />}
      {openUpload && <UploadUserModal onClose={() => setOpenUpload(false)} />}
    </div>
  );
}
