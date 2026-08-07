"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { CITIES, VIBE_TAGS } from "@/lib/mock-data";
import { COLD_START_TEMPLATES } from "@/lib/admin-mock";
import { checkBannedWords, loadBannedWords } from "@/lib/banned-words";
import ImageUpload from "@/components/image-upload";
import { MapPin, Send, Check } from "lucide-react";

export default function ColdStartHelper() {
  const [city, setCity] = useState("canberra");
  const [category, setCategory] = useState("food");
  const [templateIdx, setTemplateIdx] = useState(0);
  const [coverImage, setCoverImage] = useState("");
  const [presets, setPresets] = useState<any[]>([]);
  const [sent, setSent] = useState<string[]>([]);
  const [sending, setSending] = useState(false);

  const currentCategory = COLD_START_TEMPLATES.find((c) => c.category === category);
  const templates = currentCategory?.templates || [];
  const template = templates[templateIdx] || templates[0];
  const cityData = CITIES.find((c) => c.id === city);

  // Load presets from DB
  useEffect(() => {
    supabase.from("preset_images").select("*").order("id", { ascending: false }).then(({ data }) => setPresets(data || []));
  }, []);

  const categoryPresetMap: Record<string, string> = { food: "food", study: "study", game: "drinks", sport: "outdoor" };
  const matchingPresets = presets.filter((p) => p.category === (categoryPresetMap[category] || "other"));

  const handleSend = async () => {
    if (!template || !cityData) return;
    setSending(true);

    // Check banned words from Supabase
    const words = await loadBannedWords(supabase);
    const { hit, matched } = checkBannedWords(template.title + " " + template.description, words);
    if (hit) {
      alert(`标题或描述包含违禁词：${matched.join("、")}，请修改模板`);
      setSending(false);
      return;
    }

    // Get current user
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setSending(false); return; }

    // Insert session
    const { data: sessionData, error: sessionError } = await supabase
      .from("sessions")
      .insert({
        creator_id: session.user.id,
        title: template.title,
        description: template.description,
        location: cityData.name,
        latitude: cityData.center[0],
        longitude: cityData.center[1],
        city: city,
        start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        max_people: 4,
        cover_image: coverImage || "",
      })
      .select()
      .single();

    if (sessionError || !sessionData) {
      alert("创建失败：" + (sessionError?.message || "未知错误"));
      setSending(false);
      return;
    }

    // Insert tags
    for (const tagName of template.tags) {
      const tagDef = VIBE_TAGS.find((v) => v.name === tagName);
      await supabase.from("session_tags").insert({
        session_id: sessionData.id,
        tag_name: tagName,
        tag_type: tagDef?.type || "scene",
      });
    }

    setSent((prev) => [...prev, `${city}-${category}-${templateIdx}`]);
    setSending(false);
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-gray-100">冷启动助手</h1>
        <p className="text-sm text-gray-500 mt-0.5">一键发布真实局到 Supabase · 含违禁词检测</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">1. 选择城市</p>
          <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full h-10 px-3 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-200 focus:outline-none focus:border-purple-500">
            {CITIES.map((c) => (<option key={c.id} value={c.id}>{c.country === "AU" ? "🇦🇺" : "🇬🇧"} {c.name}</option>))}
          </select>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">2. 选择类型</p>
          <select value={category} onChange={(e) => { setCategory(e.target.value); setTemplateIdx(0); }} className="w-full h-10 px-3 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-200 focus:outline-none focus:border-purple-500">
            {COLD_START_TEMPLATES.map((cat) => (<option key={cat.category} value={cat.category}>{cat.label}</option>))}
          </select>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">3. 选择模板</p>
        {templates.map((t, i) => (
          <button key={i} onClick={() => setTemplateIdx(i)} className={`w-full text-left p-3 rounded-lg border transition-colors ${templateIdx === i ? "border-purple-500 bg-purple-500/10" : "border-gray-800 hover:border-gray-700"}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-200">{t.title}</span>
              {sent.includes(`${city}-${category}-${i}`) && <span className="text-[10px] text-green-400 flex items-center gap-1"><Check className="h-3 w-3" /> 已发布</span>}
            </div>
            <p className="text-xs text-gray-500 mt-1">{t.description}</p>
            <div className="flex gap-1 mt-2">{t.tags.map((tag) => (<span key={tag} className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded-full">{tag}</span>))}</div>
          </button>
        ))}
      </div>

      {template && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">4. 预览 & 发布</p>
          <div className="bg-gray-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-purple-400" /><span className="text-xs text-gray-400">{cityData?.name}</span></div>
            <p className="text-sm font-semibold text-gray-200">{template.title}</p>
            <p className="text-sm text-gray-400">{template.description}</p>
            <div className="flex gap-1">{template.tags.map((tag) => (<span key={tag} className="text-[10px] bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded-full">{tag}</span>))}</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">可选：封面图</p>
            {/* Preset picker */}
            {matchingPresets.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {matchingPresets.map((p) => (
                  <button key={p.id} onClick={() => setCoverImage(coverImage === p.url ? "" : p.url)}
                    className={`relative rounded-lg overflow-hidden h-20 border-2 transition-all ${coverImage === p.url ? "border-purple-400 ring-1 ring-purple-400/30" : "border-transparent hover:border-gray-600"}`}>
                    <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 text-[9px] text-white bg-black/50 px-1.5 py-0.5 rounded">{p.label}</span>
                  </button>
                ))}
              </div>
            )}
            <ImageUpload onUploaded={(url) => setCoverImage(url)} currentUrl={coverImage} />
            <div className="flex gap-2 items-center">
              <span className="text-[10px] text-gray-600 shrink-0">或粘贴URL：</span>
              <input type="text" placeholder="https://..." value={coverImage} onChange={(e) => setCoverImage(e.target.value)}
                className="flex-1 h-8 px-2 rounded bg-gray-800 border border-gray-700 text-xs text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-purple-500" />
            </div>
          </div>
          <button
            onClick={handleSend}
            disabled={sent.includes(`${city}-${category}-${templateIdx}`) || sending}
            className={`w-full h-10 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
              sent.includes(`${city}-${category}-${templateIdx}`) ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700" : "bg-purple-500 text-white hover:bg-purple-600"
            }`}
          >
            {sending ? "发布中..." : sent.includes(`${city}-${category}-${templateIdx}`) ? <><Check className="h-4 w-4" /> 已发布</> : <><Send className="h-4 w-4" /> 发布到 {cityData?.name}</>}
          </button>
        </div>
      )}
    </div>
  );
}
