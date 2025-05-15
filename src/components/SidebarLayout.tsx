"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LayoutDashboard, LifeBuoy, Settings, X } from "lucide-react";
import LogoutButton from "../components/logoutButton";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Support", href: "/support", icon: LifeBuoy },
  { label: "Settings", href: "/settings", icon: Settings },
];

const brandColor = "#f2ad1f";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-white to-slate-100 text-gray-900 font-sans">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-md bg-white shadow hover:bg-gray-100 transition"
        >
          <Menu className="text-gray-800" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white shadow-lg p-6 sticky top-0 h-screen">
        <div className="mb-12">
          <h1
            className="text-3xl font-extrabold tracking-tight"
            style={{ color: brandColor }}
          >
            MailForge
          </h1>
          <p className="text-sm text-gray-400 mt-1">Design. Drag. Deliver.</p>
        </div>

        <nav className="space-y-2">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition font-medium ${
                  isActive
                    ? "bg-orange-100 text-orange-400"
                    : "text-gray-700 hover:bg-gray-100 hover:text-orange-400"
                }`}
                style={
                  isActive
                    ? { backgroundColor: "#fef3e6", color: brandColor }
                    : {}
                }
              >
                <Icon size={20} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Your sidebar content */}
        <div className="mt-auto flex items-center gap-3 px-3 py-2 rounded-md transition font-medium">
          <LogoutButton />
        </div>

        <div className="pt-10 text-xs text-gray-400">
          © {new Date().getFullYear()} Franz Ocubillo
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg p-6 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1
                  className="text-2xl font-extrabold"
                  style={{ color: brandColor }}
                >
                  MailForge
                </h1>
                <p className="text-xs text-gray-400">
                  Drag & drop email builder
                </p>
              </div>
              <button onClick={() => setIsOpen(false)}>
                <X />
              </button>
            </div>

            <nav className="space-y-2">
              {navItems.map(({ label, href, icon: Icon }) => {
                const isActive = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition font-medium ${
                      isActive
                        ? "bg-orange-100 text-orange-700"
                        : "text-gray-700 hover:bg-gray-100 hover:text-orange-600"
                    }`}
                    style={
                      isActive
                        ? { backgroundColor: "#fef3e6", color: brandColor }
                        : {}
                    }
                  >
                    <Icon size={20} />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-2 md:p-4 shadow-lg">{children}</main>
    </div>
  );
}
