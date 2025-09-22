"use client";

import { useState } from "react";
import ResignUserTable from "@/components/ResignUserTable";
import AddUserModal from "@/components/AddUserModal";
import UploadUserModal from "@/components/UploadUserModal"; 

export default function UserPage() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Resign User Management</h1>

        <div className="flex space-x-2">
        </div>
      </div>

      <ResignUserTable />

      {openAdd && <AddUserModal onClose={() => setOpenAdd(false)} />}
      {openUpload && <UploadUserModal onClose={() => setOpenUpload(false)} />}
    </div>
  );
}
