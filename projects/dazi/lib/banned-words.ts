export interface BannedWord {
  id: string;
  word: string;
  category: "contact" | "sensitive" | "spam";
}

const CATEGORY_LABELS: Record<string, string> = {
  contact: "联系方式",
  sensitive: "敏感内容",
  spam: "营销导流",
};

export function getCategoryLabel(cat: string): string {
  return CATEGORY_LABELS[cat] || cat;
}

export const DEFAULT_BANNED_WORDS: BannedWord[] = [
  // 联系方式
  { id: "b1", word: "微信", category: "contact" },
  { id: "b2", word: "WeChat", category: "contact" },
  { id: "b3", word: "微信号", category: "contact" },
  { id: "b4", word: "加我", category: "contact" },
  { id: "b5", word: "QQ", category: "contact" },
  { id: "b6", word: "群号", category: "contact" },
  { id: "b7", word: "加群", category: "contact" },
  { id: "b8", word: "手机号", category: "contact" },
  { id: "b9", word: "电话", category: "contact" },
  { id: "b10", word: "Ins", category: "contact" },
  { id: "b11", word: "Instagram", category: "contact" },
  { id: "b12", word: "Snapchat", category: "contact" },
  { id: "b13", word: "Telegram", category: "contact" },
  { id: "b14", word: "WhatsApp", category: "contact" },
  // 敏感内容
  { id: "b15", word: "约炮", category: "sensitive" },
  { id: "b16", word: "一夜情", category: "sensitive" },
  { id: "b17", word: "包养", category: "sensitive" },
  { id: "b18", word: "援交", category: "sensitive" },
  { id: "b19", word: "代购", category: "sensitive" },
  { id: "b20", word: "代写", category: "sensitive" },
  { id: "b21", word: "代考", category: "sensitive" },
  { id: "b22", word: "黄片", category: "sensitive" },
  { id: "b23", word: "赌博", category: "sensitive" },
  { id: "b24", word: "嫖娼", category: "sensitive" },
  { id: "b25", word: "OnlyFans", category: "sensitive" },
  { id: "b26", word: "援交妹", category: "sensitive" },
  { id: "b27", word: "卖淫", category: "sensitive" },
  { id: "b28", word: "吸毒", category: "sensitive" },
  // 营销导流
  { id: "b29", word: "公众号", category: "spam" },
  { id: "b30", word: "关注我", category: "spam" },
  { id: "b31", word: "私聊", category: "spam" },
  { id: "b32", word: "私信", category: "spam" },
  { id: "b33", word: "加好友", category: "spam" },
  { id: "b34", word: "http://", category: "spam" },
  { id: "b35", word: "https://", category: "spam" },
  { id: "b36", word: ".com", category: "spam" },
  { id: "b37", word: "www.", category: "spam" },
  { id: "b38", word: "DM", category: "spam" },
  { id: "b39", word: ".cn", category: "spam" },
];

export function checkBannedWords(text: string, words: { word: string }[]): { hit: boolean; matched: string[] } {
  const lower = text.toLowerCase();
  const matched: string[] = [];
  for (const w of words) {
    if (lower.includes(w.word.toLowerCase())) {
      matched.push(w.word);
    }
  }
  return { hit: matched.length > 0, matched };
}

export async function loadBannedWords(supabase: any): Promise<{ word: string }[]> {
  const { data } = await supabase.from("banned_words").select("word");
  return data || [];
}
