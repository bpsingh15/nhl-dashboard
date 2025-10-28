"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, List, ChartBarBig } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/", icon: Home },
    { name: "Standings", href: "/standings", icon: BarChart3 },
    { name: "Teams", href: "/teams", icon: List },
    { name: "Stats", href: "/stats", icon: ChartBarBig },
  ];

  return (
    <aside className="w-[15%] min-w-[200px] bg-[#0A0A1A] border-r border-gray-800 p-6 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-10">🏒 NHL Hub</h1>
        <nav className="flex flex-col gap-3">
          {links.map(({ name, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === href
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-[#1a1a3a] hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span>{name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div>
        <button className="w-full mt-8 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-sm rounded-lg font-semibold">
          Upgrade ✨
        </button>
      </div>
    </aside>
  );
}
