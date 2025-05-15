"use client";
import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Save, FileText } from "lucide-react";

const EmailEditor = dynamic(() => import("react-email-editor"), { ssr: false });

export default function EmailBuilder() {
  const [name, setName] = useState("");
  const emailEditorRef = useRef<any>(null);
  const router = useRouter();

  const handleSave = async () => {
    if (!name) return alert("Template name is required.");

    emailEditorRef.current?.editor?.exportHtml(async (data: any) => {
      let { html } = data;

      // Inject viewport meta tag for mobile scaling
      if (!html.includes('<meta name="viewport"')) {
        html = html.replace(
          "<head>",
          `<head><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />`
        );
      }

      // Optional: Inject mobile-friendly CSS for better responsiveness
      const mobileCss = `
      <style>
        /* Ensure images scale on mobile */
        img {
          max-width: 100% !important;
          height: auto !important;
          display: block;
          margin: 0 auto;
        }
        /* Prevent email body from exceeding screen width */
        body, table {
          max-width: 600px !important;
          width: 100% !important;
          margin: 0 auto !important;
        }
        /* Stack columns on mobile */
        @media only screen and (max-width: 480px) {
          .container, .row {
            width: 100% !important;
            display: block !important;
          }
          .column {
            width: 100% !important;
            display: block !important;
          }
        }
      </style>
    `;

      if (!html.includes(mobileCss.trim())) {
        html = html.replace("</head>", `${mobileCss}</head>`);
      }

      const { data: result, error } = await supabase.from("templates").insert([
        {
          name,
          html,
        },
      ]);

      if (error) {
        console.error("Error saving template:", error.message);
        alert("Failed to save. Check console.");
      } else {
        console.log("Template saved successfully:", result);
        alert("Template saved!");
        router.push("/dashboard");
      }
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto rounded-xl shadow-lg bg-white p-6 border border-gray-200">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8">
          Create Email Template
        </h1>

        {/* Input + Save Button Group */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <input
            type="text"
            className="flex-grow max-w-md p-3 rounded-md border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Template Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Save Template"
          >
            <Save size={20} />
            Save Template
          </button>
        </div>

        <div className="mb-6 rounded-lg overflow-hidden border border-gray-200 shadow-inner">
          <EmailEditor ref={emailEditorRef} />
        </div>

        <p className="text-gray-600 text-sm mt-2 flex items-center gap-2">
          <FileText size={16} /> Note: Preview your template carefully before
          saving to ensure formatting is correct.
        </p>
      </div>
    </div>
  );
}
