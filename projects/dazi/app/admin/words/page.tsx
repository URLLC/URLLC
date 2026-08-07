"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getCategoryLabel } from "@/lib/banned-words";
import { Plus, Trash2 } from "lucide-react";

export default function BannedWordsPage() {
  const [words, setWords] = useState<any[]>([]);
  const [newWord, setNewWord] = useState("");
  const [newCategory, setNewCategory] = useState("contact");

  useEffect(() => { fetchWords(); }, []);

  const fetchWords = () => {
    supabase.from("banned_words").select("*").order("id", { ascending: false })
      .then(({ data }) => setWords(data || []));
  };

  const addWord = async () => {
    const w = newWord.trim();
    if (!w) return;
    await supabase.from("banned_words").insert({ word: w, category: newCategory });
    setNewWord("");
    fetchWords();
  };

  const deleteWord = async (id: number) => {
    await supabase.from("banned_words").delete().eq("id", id);
    fetchWords();
  };

  const categories = Array.from(new Set(words.map((w) => w.category)));

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-gray-100">违禁词库</h1>
        <p className="text-sm text-gray-500 mt-0.5">发局时自动检测 · 共 {words.length} 个词 · 存储在 Supabase</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-end gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label className="text-[10px] text-gray-500 uppercase tracking-wider">违禁词</label>
          <input value={newWord} onChange={(e) => setNewWord(e.target.value)} placeholder="输入违禁词"
            className="w-full h-9 px-3 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-purple-500 mt-1" />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider">分类</label>
          <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
            className="w-28 h-9 px-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-200 focus:outline-none focus:border-purple-500 mt-1">
            <option value="contact">联系方式</option>
            <option value="sensitive">敏感内容</option>
            <option value="spam">营销导流</option>
            <option value="other">其他</option>
          </select>
        </div>
        <button onClick={addWord} disabled={!newWord.trim()} className="h-9 px-4 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium flex items-center gap-1 disabled:opacity-50">
          <Plus className="h-4 w-4" /> 添加
        </button>
      </div>

      {categories.map((cat) => {
        const list = words.filter((w) => w.category === cat);
        return (
          <div key={cat} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-200">{getCategoryLabel(cat)} ({list.length})</p>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-gray-500"><th className="px-4 py-2.5 font-medium">关键词</th><th className="px-4 py-2.5 w-16"></th></tr></thead>
              <tbody className="divide-y divide-gray-800">
                {list.map((w) => (
                  <tr key={w.id} className="hover:bg-gray-800/50">
                    <td className="px-4 py-2.5 text-gray-300">{w.word}</td>
                    <td className="px-4 py-2.5">
                      <button onClick={() => deleteWord(w.id)} className="p-1.5 rounded text-gray-600 hover:text-red-400 hover:bg-gray-800"><Trash2 className="h-3.5 w-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
