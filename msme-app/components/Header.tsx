"use client";

import { Bell, User, ChevronDown, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Header() {
  const router = useRouter();
  const [showNotif, setShowNotif] = useState(false);
  const [displayName, setDisplayName] = useState("User");
  const [role, setRole] = useState("Admin");

  useEffect(() => {
    const supabase = createClient();

    const updateUserInfo = (metadata: Record<string, unknown> | null, email?: string | null) => {
      const name = typeof metadata?.full_name === "string" ? metadata.full_name : null;
      const company = typeof metadata?.company_name === "string" ? metadata.company_name : null;
      setDisplayName(name || email || "User");
      setRole(company || "Admin");
    };

    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error) {
        console.error("Header: failed to fetch user", error.message);
        return;
      }
      if (user) {
        updateUserInfo(user.user_metadata as Record<string, unknown>, user.email);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      updateUserInfo(
        user ? (user.user_metadata as Record<string, unknown>) : null,
        user?.email,
      );
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push("/login");
      router.refresh();
    }
  };

  const notifications = [
    { id: 1, text: "⚠️ Black Dye stock critically low (80/200 litres)", time: "5m ago" },
    { id: 2, text: "📦 Myntra order ready to ship", time: "23m ago" },
    { id: 3, text: "🚨 Packaging Machine at 100% capacity", time: "1h ago" },
    { id: 4, text: "📈 Penguin Reels trending +400% — R&D alert", time: "2h ago" },
  ];

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">MSME Growth OS</h1>
        <p className="text-xs text-gray-500">Integrated Factory & Business Intelligence</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          {showNotif && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-gray-200 bg-white shadow-xl z-50">
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="text-sm font-semibold text-gray-800">Notifications</p>
              </div>
              <ul className="divide-y divide-gray-100">
                {notifications.map((n) => (
                  <li key={n.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm text-gray-700">{n.text}</p>
                    <p className="mt-0.5 text-xs text-gray-400">{n.time}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* User Profile */}
        <button className="flex items-center gap-2 rounded-full border border-gray-200 py-1.5 pl-1.5 pr-3 hover:bg-gray-50 transition-colors">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white">
            <User className="h-4 w-4" />
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-gray-800 leading-tight">{displayName}</p>
            <p className="text-xs text-gray-400">{role}</p>
          </div>
          <ChevronDown className="h-3 w-3 text-gray-400 ml-1" />
        </button>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
}
