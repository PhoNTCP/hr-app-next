"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useMemo, useState } from "react";
import { Home, Users, FileText, ChevronDown, Settings } from "lucide-react";

type Item = { href: string; label: string; icon?: ReactNode };
type Group = { label: string; icon?: ReactNode; items: Item[]; base: string };

const navTop: Item[] = [
  { href: "/home", label: "Home", icon: <Home className="w-4 h-4" /> },
  { href: "/user", label: "User", icon: <Users className="w-4 h-4" /> },
  { href: "/resign-user", label: "Resign User", icon: <FileText className="w-4 h-4" /> },
  { href: "/scb-surety-account", label: "SCB Surety Account" },
  { href: "/fine", label: "Fine" },
  { href: "/huatons", label: "Huatons" },
  { href: "/fair-slip", label: "Fair Slip" },
  { href: "/pay-slip", label: "Pay Slip" },
  { href: "/broadcast-news", label: "Broadcast News" },
];

const navGroups: Group[] = [
  {
    label: "Contact",
    icon: <Users className="w-4 h-4" />,
    base: "/contact",
    items: [
      { href: "/contact/employee", label: "Employee" },
      { href: "/contact/department", label: "Department" },
    ],
  },
  {
    label: "Bot Config",
    icon: <Settings className="w-4 h-4" />,
    base: "/bot-config",
    items: [
      { href: "/bot-config/keyword", label: "Keyword" },
      { href: "/bot-config/template", label: "Message Template" },
    ],
  },
];

function NavLink({ href, label, icon }: Item) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors
        ${active ? "bg-white/10 text-white" : "text-gray-300 hover:text-white hover:bg-white/5"}`}
    >
      {icon}
      <span className="truncate">{label}</span>
    </Link>
  );
}

function NavGroup({ group }: { group: Group }) {
  const pathname = usePathname();
  const defaultOpen = useMemo(() => pathname.startsWith(group.base), [pathname, group.base]);
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full px-3 py-2 text-left text-gray-200 rounded-md hover:text-white hover:bg-white/5"
      >
        <span className="flex items-center gap-2">
          {group.icon}
          <span className="font-medium">{group.label}</span>
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <div className={`grid overflow-hidden transition-all ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="min-h-0">
          {group.items.map(it => (
            <div key={it.href} className="mt-1 ml-3">
              <NavLink href={it.href} label={it.label} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 overflow-y-auto bg-[#0f172a] text-gray-200">
      <div className="px-4 py-4 text-lg font-bold tracking-wide">HR Connect</div>

      <nav className="px-2 pb-6 space-y-1">
        {navTop.map(it => (
          <NavLink key={it.href} {...it} />
        ))}
        {navGroups.map(g => (
          <NavGroup key={g.base} group={g} />
        ))}
      </nav>
    </aside>
  );
}
