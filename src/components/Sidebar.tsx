"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { label: "Home", path: "/home" },
  { label: "User", path: "/user" },
  { label: "Resign User", path: "/resign-user" },
  { label: "SCB Surety Account", path: "/scb" },
  { label: "Fine", path: "/fine" },
  { label: "Huetons", path: "/huetons" },
  { label: "Fair Slip", path: "/fair-slip" },
  { label: "Pay Slip", path: "/pay-slip" },
  { label: "Broadcast News", path: "/news" },
  { label: "Contact", path: "/contact" },
  { label: "Bot Config", path: "/bot-config" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen p-4 text-white bg-gray-900">
      <h2 className="mb-6 text-xl font-bold">HR Connect</h2>
      <nav className="flex flex-col gap-2">
        {menu.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`p-2 rounded hover:bg-gray-700 ${
              pathname === item.path ? "bg-gray-700" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
