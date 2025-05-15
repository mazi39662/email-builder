"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const brandColor = "#fb923c"; // Muted, professional orange

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data?.user) {
      router.push("/dashboard");
    } else if (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-4">
      <div className="max-w-4xl w-full flex flex-col lg:flex-row bg-white shadow-xl rounded-xl overflow-hidden border border-orange-100">
        {/* Left Section */}
        <div className="w-full lg:w-1/2 p-8 bg-[#fff7ed] text-gray-800 flex flex-col justify-center">
          {/* Temporary Logo */}
          <div className="mb-5">
            <h1
              className="text-3xl font-extrabold tracking-tight"
              style={{ color: brandColor }}
            >
              MailForge
            </h1>
            <p className="text-sm text-gray-500 mt-1">Design. Drag. Deliver.</p>
          </div>

          <h2 className="text-xl font-semibold mb-3">
            ⚡ Build beautiful emails fast
          </h2>
          <p className="text-sm mb-3 text-gray-600 border-b pb-3">
            Create and customize professional email templates with an intuitive
            drag-and-drop builder. Perfect for marketers, startups, and teams
            who want speed and design power.
          </p>

          <div className="mb-4">
            <h3 className="text-md font-semibold">
              💳 Payment Required for Access
            </h3>
            <p className="text-sm mt-2 text-gray-700">
              This app is currently in MVP mode. You can activate your account
              with a small payment via:
            </p>
            <ul className="list-disc ml-6 mt-2 text-sm text-gray-700">
              <li>PayPal</li>
              <li>GCash</li>
            </ul>
            <p className="mt-4 text-sm text-gray-700">
              {" "}
              Message us on Viber then Send your payment receipt to our Viber
              number:
              <br />
              <strong className="text-gray-900">📲 0977 104 3990</strong>
            </p>
            <p className="mt-2 text-sm italic text-gray-500">
              We&apos;ll activate your access shortly after verifying your
              payment.
            </p>
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="w-full lg:w-1/2 p-8">
          <h2
            className="text-3xl font-bold text-center mb-6"
            style={{ color: brandColor }}
          >
            Log In
          </h2>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 text-black"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-[#fb923c] text-white text-lg font-semibold py-3 rounded-md hover:bg-[#f97316] transition duration-200"
          >
            Log In
          </button>

          <p className="mt-4 text-center text-sm text-gray-500">
            Don&apos;t have an account? <br />
            message <strong>+639771043990</strong> on Viber.
            {/* <a href="/signup" className="text-orange-500 hover:underline">
              Sign Up
            </a> */}
          </p>
        </div>
      </div>
      <br />
      <h3
        className="font-extrabold tracking-tight"
        style={{ color: brandColor }}
      >
        Developed By Cypher Studio
      </h3>
      <p className="text-gray-400 text-sm">v1.0.0 - MVP</p>
    </main>
  );
}
