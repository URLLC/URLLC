"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Plus } from "lucide-react";

const CATEGORIES = [
  { key: "food", label: "🍜 美食" },
  { key: "study", label: "📚 学习" },
  { key: "drinks", label: "🍷 酒吧" },
  { key: "outdoor", label: "🚶 户外" },
  { key: "other", label: "🎲 其他" },
];

export default function ImagesPage() {
  const [images, setImages] = useState<any[]>([]);
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("food");
  const [label, setLabel] = useState("");

  const fetchImages = () => {
    supabase.from("preset_images").select("*").order("id", { ascending: false })
      .then(({ data }) => setImages(data || []));
  };

  useEffect(() => { fetchImages(); }, []);

  const addImage = async () => {
    if (!url.trim()) return;
    await supabase.from("preset_images").insert({ url: url.trim(), category, label: label || category });
    setUrl(""); setLabel("");
    fetchImages();
  };

  const deleteImage = async (id: number) => {
    await supabase.from("preset_images").delete().eq("id", id);
    fetchImages();
  };

  return (
    <div className="space-y-5 max-w-5xl">
      <div>
        <h1 className="text-xl font-bold text-gray-100">图片库管理</h1>
        <p className="text-sm text-gray-500 mt-0.5">预设封面图库 · 用户发局时从此库选择</p>
      </div>

      {/* Add form */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-end gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label className="text-[10px] text-gray-500 uppercase tracking-wider">图片 URL</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://images.unsplash.com/..."
            className="w-full h-9 px-3 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-purple-500 mt-1" />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider">分类</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="w-28 h-9 px-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-200 focus:outline-none focus:border-purple-500 mt-1">
            {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
        </div>
        <div className="w-24">
          <label className="text-[10px] text-gray-500 uppercase tracking-wider">标签</label>
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="火锅"
            className="w-full h-9 px-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-purple-500 mt-1" />
        </div>
        <button onClick={addImage} disabled={!url.trim()} className="h-9 px-4 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium flex items-center gap-1 disabled:opacity-50">
          <Plus className="h-4 w-4" /> 添加
        </button>
      </div>

      {/* Gallery by category */}
      {CATEGORIES.map((cat) => {
        const list = images.filter((i) => i.category === cat.key);
        return (
          <div key={cat.key} className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-300">{cat.label} ({list.length})</h3>
            <div className="grid grid-cols-4 gap-3">
              {list.map((img) => (
                <div key={img.id} className="relative group rounded-xl overflow-hidden bg-gray-800 border border-gray-800">
                  <img src={img.url} alt={img.label} className="w-full h-28 object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <button onClick={() => deleteImage(img.id)} className="opacity-0 group-hover:opacity-100 h-8 w-8 rounded-full bg-red-500/80 text-white flex items-center justify-center transition-all">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 px-2 py-1 truncate">{img.label || img.category}</p>
                </div>
              ))}
              {list.length === 0 && <p className="text-xs text-gray-600 col-span-4 py-4">暂无图片</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
