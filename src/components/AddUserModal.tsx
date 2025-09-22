"use client";

import { useState, useEffect } from "react";

interface AddUserModalProps {
  onClose: () => void;
  initialData?: any; // ใช้ตอน Edit
}

export default function AddUserModal({ onClose, initialData }: AddUserModalProps) {
  const [form, setForm] = useState({
    thaiId: "",
    code: "",
    empCode: "",
    nickName: "",
    name: "",
    surname: "",
    engName: "",
    engSurname: "",
    title: "",
    bankNo: "",
    email: "",
    lineId: "",
    companyPhoneNo: "",
    internalExtension: "",
    personalPhoneNo: "",
    status: "A",
  });

  // preload ค่าเดิมตอน Edit
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = initialData
      ? `/api/init-users?id=${initialData.id}` // PUT
      : "/api/init-users";                    // POST
    const method = initialData ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert(initialData ? "User updated successfully!" : "User added successfully!");
      onClose();
      window.location.reload();
    } else {
      alert("Failed to save user.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-[800px] max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            {initialData ? "Edit User" : "Add New User"}
          </h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input name="thaiId" placeholder="Thai ID" value={form.thaiId ?? ""} onChange={handleChange} className="p-2 border rounded" required />
          <input name="code" placeholder="Code" value={form.code ?? ""} onChange={handleChange} className="p-2 border rounded" required />
          <input name="empCode" placeholder="Employee Code" value={form.empCode ?? ""} onChange={handleChange} className="p-2 border rounded" /> 
          <input name="nickName" placeholder="Nick Name" value={form.nickName ?? ""} onChange={handleChange} className="p-2 border rounded" />
          <input name="name" placeholder="Name (ไทย)" value={form.name ?? ""} onChange={handleChange} className="p-2 border rounded" required />
          <input name="surname" placeholder="Surname (ไทย)" value={form.surname ?? ""} onChange={handleChange} className="p-2 border rounded" required />
          <input name="engName" placeholder="Name (Eng)" value={form.engName ?? ""} onChange={handleChange} className="p-2 border rounded" /> 
          <input name="engSurname" placeholder="Surname (Eng)" value={form.engSurname ?? ""} onChange={handleChange} className="p-2 border rounded" />
          <input name="bankNo" placeholder="SCB Surety Acc. No." value={form.bankNo ?? ""} onChange={handleChange} className="p-2 border rounded" /> 
          <input name="email" placeholder="Email" type="email" value={form.email ?? ""} onChange={handleChange} className="p-2 border rounded" />
          <input name="title" placeholder="Title" value={form.title ?? ""} onChange={handleChange} className="p-2 border rounded" />
          <input name="lineId" placeholder="Line ID" value={form.lineId ?? ""} onChange={handleChange} className="p-2 border rounded" />
          <input name="companyPhoneNo" placeholder="Company Telephone Number" value={form.companyPhoneNo ?? ""} onChange={handleChange} className="p-2 border rounded" /> 
          <input name="internalExtension" placeholder="Internal Extension" value={form.internalExtension ?? ""} onChange={handleChange} className="p-2 border rounded" /> 
          <input name="personalPhoneNo" placeholder="Personal Telephone Number" value={form.personalPhoneNo ?? ""} onChange={handleChange} className="col-span-2 p-2 border rounded" />
          <div className="flex justify-end col-span-2 gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-white bg-gray-400 rounded">Close</button>
            <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
              {initialData ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
