"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarClock,
  BarChart3,
  Factory,
  Lightbulb,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/",               label: "Dashboard",        icon: LayoutDashboard },
  { href: "/planning",       label: "Production Planning", icon: CalendarClock },
  { href: "/analytics",      label: "Performance Analytics", icon: BarChart3 },
  { href: "/infrastructure", label: "Infrastructure",    icon: Factory },
  { href: "/innovation",     label: "Innovation Tracking", icon: Lightbulb },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white shadow-sm">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-6">
        <TrendingUp className="h-7 w-7 text-blue-600" />
        <div>
          <p className="text-sm font-bold text-gray-900 leading-tight">MSME Growth OS</p>
          <p className="text-xs text-gray-500">Factory Intelligence</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Icon className={cn("h-5 w-5", active ? "text-blue-600" : "text-gray-400")} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <p className="text-xs text-gray-400 text-center">v1.0.0 · MSME Growth OS</p>
      </div>
    </aside>
  );
}
