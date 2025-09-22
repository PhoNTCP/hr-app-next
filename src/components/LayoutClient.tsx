"use client";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
