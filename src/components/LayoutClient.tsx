"use client";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-400/25 to-emerald-400/25 dark:from-[#0f172a] dark:to-[#0b1d16]">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 ">
          <Topbar />
          <main className="min-w-0 p-6 space-y-4 ">{children}</main>
        </div>
      </div>
    </div>
  );
}
