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
    <aside
      className="glass-sidebar"
    >
      <div className="flex items-center gap-3 px-2 mb-3">
        <div className="size-9 rounded-2xl bg-neutral-900" />
        <div className="text-lg font-semibold tracking-tight">HR Connect</div>
      </div>

      <nav className="flex flex-col gap-1">
        {menu.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`glass-link ${pathname === item.path ? "glass-link-active" : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="pt-6 mt-6 text-xs text-neutral-500">v1.0</div>
    </aside>
  );
}
