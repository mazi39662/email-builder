"use client";

import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-3 py-2 mt-4 rounded-md text-gray-700 hover:bg-red-100 hover:text-red-500 transition font-medium w-full"
    >
      <LogOut size={18} />
      Logout
    </button>
  );
}
