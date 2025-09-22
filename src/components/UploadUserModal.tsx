"use client";

import { useState } from "react";

type ModalProps = {
  onClose: () => void;
};

export default function UploadUserModal({ onClose }: ModalProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return alert("กรุณาเลือกไฟล์");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/init-users/excel", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      alert(`อัพโหลดสำเร็จ ${data.count} users`);
      onClose();
      window.location.reload();
    } else {
      alert("Upload failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-[500px] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Import Users</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            ✕
          </button>
        </div>

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-4"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white bg-gray-400 rounded"
          >
            Close
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
