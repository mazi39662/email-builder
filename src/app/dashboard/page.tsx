"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Eye, Trash2, Edit, FileDown, Copy, Plus } from "lucide-react";

interface Template {
  id: string;
  name: string;
  html: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      const { data, error } = await supabase.from("templates").select("*");
      if (error) console.error(error);
      else setTemplates(data || []);
      setLoading(false);
    };
    fetchTemplates();
  }, []);

  const downloadHTML = (template: Template) => {
    const blob = new Blob([template.html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${template.name}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyRenderedHTML = (html: string) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    temp.contentEditable = "true";
    temp.style.position = "fixed";
    temp.style.opacity = "0";
    document.body.appendChild(temp);
    const range = document.createRange();
    range.selectNodeContents(temp);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    document.execCommand("copy");
    document.body.removeChild(temp);
    alert("Rendered HTML copied!");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this template?")) return;
    const { error } = await supabase.from("templates").delete().eq("id", id);
    if (error) console.error(error);
    else setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;
    const { error } = await supabase
      .from("templates")
      .update({ name: editingTemplate.name, html: editingTemplate.html })
      .eq("id", editingTemplate.id);
    if (error) console.error(error);
    else {
      setTemplates((prev) =>
        prev.map((t) => (t.id === editingTemplate.id ? editingTemplate : t))
      );
      setEditingTemplate(null);
    }
  };

  return (
    <div className="p-4 bg-white min-h-screen text-gray-900 rounded-xl">
      <div className="min-h-screen shadow-lg p-8 rounded-xl">
        <h1 className="text-4xl font-bold mb-4">Templates</h1>
        <button
          onClick={() => router.push("/editor")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-8 flex items-center gap-2"
        >
          <Plus size={16} /> Create New Template
        </button>

        {loading ? (
          <p>Loading...</p>
        ) : templates.length === 0 ? (
          <p>No templates found.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {templates.map((t) => (
              <div key={t.id} className="p-5 rounded-xl shadow-lg">
                <div className="flex justify-between mb-3">
                  <h2 className="text-xl font-semibold truncate max-w-[70%]">
                    {t.name}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingTemplate(t)}
                      className="hover:bg-blue-700 hover:text-white p-3 rounded text-gray-900"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="hover:bg-red-700 hover:text-white p-3 rounded text-gray-900"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <iframe
                  srcDoc={t.html}
                  className="w-full h-48 mb-3 rounded border border-gray-300"
                  sandbox=""
                />

                <div className="flex justify-between text-sm">
                  <button
                    onClick={() => setPreviewTemplate(t)}
                    className="hover:shadow-sm text-blue-600 shadow-md p-2 rounded-md"
                  >
                    <Eye size={16} className="inline mr-1" /> Preview
                  </button>
                  <button
                    onClick={() => copyRenderedHTML(t.html)}
                    className="bg-orange-400 hover:bg-orange-500 p-2 rounded text-white shadow-md hover:shadow-sm"
                  >
                    <Copy size={16} className="inline mr-1" /> Try it out
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white text-gray-900 rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-auto shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Preview</h2>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-gray-600 hover:text-gray-900 font-bold"
              >
                ✕
              </button>
            </div>
            <div
              className="border p-4 bg-gray-50"
              dangerouslySetInnerHTML={{ __html: previewTemplate.html }}
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard
                    .writeText(previewTemplate.html)
                    .then(() => {
                      alert("HTML copied to clipboard!");
                    });
                }}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                <Copy size={16} className="inline mr-1" /> Copy HTML
              </button>

              <button
                onClick={() => copyRenderedHTML(previewTemplate.html)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                <Copy size={16} className="inline mr-1" /> Copy Rendered
              </button>
              <button
                onClick={() => downloadHTML(previewTemplate)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                <FileDown size={16} className="inline mr-1" /> Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white text-gray-900 rounded-lg p-6 max-w-2xl w-full shadow-lg">
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-semibold">Name</label>
                <input
                  type="text"
                  value={editingTemplate.name}
                  onChange={(e) =>
                    setEditingTemplate({
                      ...editingTemplate,
                      name: e.target.value,
                    })
                  }
                  className="w-full border rounded px-3 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold">HTML</label>
                <textarea
                  value={editingTemplate.html}
                  onChange={(e) =>
                    setEditingTemplate({
                      ...editingTemplate,
                      html: e.target.value,
                    })
                  }
                  rows={10}
                  className="w-full border rounded px-3 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="px-4 py-2 border rounded border-gray-400 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
