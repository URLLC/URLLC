import { MOCK_USERS, MOCK_SESSIONS, CITIES } from "./mock-data";
import type { BannedWord } from "./banned-words";
import { DEFAULT_BANNED_WORDS } from "./banned-words";

export interface Report {
  id: string;
  reportedUserId: string;
  reportedUserName: string;
  reporterId: string;
  reporterName: string;
  sessionId: string;
  sessionTitle: string;
  reason: string;
  status: "pending" | "resolved_ignored" | "resolved_deleted" | "resolved_banned";
  createdAt: string;
}

export const MOCK_REPORTS: Report[] = [
  { id: "r1", reportedUserId: "u4", reportedUserName: "阿杰", reporterId: "u5", reporterName: "Mia", sessionId: "s1", sessionTitle: "今晚 ANU 韩餐局 🍜", reason: "发私信骚扰，说一些让人不舒服的话", status: "pending", createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "r2", reportedUserId: "u6", reportedUserName: "Oliver", reporterId: "u3", reporterName: "Yuki", sessionId: "s7", sessionTitle: "Bondi Beach brunch 🏖️", reason: "放鸽子，连续两次约好不来", status: "pending", createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: "r3", reportedUserId: "u2", reportedUserName: "Lucas", reporterId: "u1", reporterName: "小糖", sessionId: "s4", sessionTitle: "周五酒吧微醺局 🍷", reason: "局上推销代购产品", status: "resolved_ignored", createdAt: new Date(Date.now() - 86400000).toISOString() },
];

export interface AuditRecord {
  id: string;
  sessionId: string;
  sessionTitle: string;
  creatorName: string;
  result: "auto_pass" | "auto_block" | "manual_pass" | "manual_block";
  matchedWords: string[];
  createdAt: string;
}

export const MOCK_AUDITS: AuditRecord[] = [
  { id: "a1", sessionId: "s1", sessionTitle: "今晚 ANU 韩餐局 🍜", creatorName: "Yuki", result: "auto_pass", matchedWords: [], createdAt: new Date(Date.now() - 18000000).toISOString() },
  { id: "a2", sessionId: "s2", sessionTitle: "周末 citywalk 📸", creatorName: "小糖", result: "auto_pass", matchedWords: [], createdAt: new Date(Date.now() - 36000000).toISOString() },
  { id: "a3", sessionId: "temp1", sessionTitle: "加我微信 xxx 约饭", creatorName: "测试用户", result: "auto_block", matchedWords: ["微信", "加我"], createdAt: new Date(Date.now() - 7200000).toISOString() },
];

export function getCityStats(city: string) {
  const sessions = MOCK_SESSIONS.filter((s) => s.city === city);
  const participants = new Set(sessions.flatMap((s) => s.members.map((m) => m.id)));
  return { sessions: sessions.length, participants: participants.size };
}

export function getDashboardStats() {
  const today = new Date().toDateString();
  const todaySessions = MOCK_SESSIONS.filter((s) => new Date(s.createdAt).toDateString() === today);
  const totalUsers = MOCK_USERS.length;
  const totalSessions = MOCK_SESSIONS.length;
  const pendingReports = MOCK_REPORTS.filter((r) => r.status === "pending").length;
  return {
    todaySessions: todaySessions.length,
    totalUsers,
    totalSessions,
    pendingReports,
    newUsersToday: 3,
  };
}

export function getBannedWords(): BannedWord[] {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("dazi-banned-words");
    if (saved) return JSON.parse(saved);
  }
  return DEFAULT_BANNED_WORDS;
}

export function saveBannedWords(words: BannedWord[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("dazi-banned-words", JSON.stringify(words));
  }
}

export const COLD_START_TEMPLATES = [
  {
    label: "🍜 美食探店",
    category: "food",
    templates: [
      { title: "周末火锅续命局 🔥", description: "期末周压力太大了，周末找个火锅店大吃一顿。AA制，单纯干饭不尬聊。", tags: ["纯饭搭子", "AA", "探店"] },
      { title: "韩餐探店搭子 🍜", description: "想去那家新开的韩餐店试试，一个人点不了太多菜。2-3个人刚好。", tags: ["纯饭搭子", "探店", "女生局"] },
      { title: "Brunch 探店 ☕", description: "周六早上约个brunch，拍拍照聊聊天。适合想认识新朋友的。", tags: ["探店", "纯聊天", "新人友好"] },
    ],
  },
  {
    label: "📚 学习搭子",
    category: "study",
    templates: [
      { title: "图书馆学习搭子 📚", description: "一起学但不一定学一样，主要是互相监督别摸鱼。每小时可以休息聊两句。", tags: ["期末发疯", "i人友好", "社恐友好"] },
      { title: "期末自习室占位 🏃", description: "帮忙占位置，互相监督。安静自习为主，休息时可以交流。", tags: ["期末发疯", "i人友好"] },
    ],
  },
  {
    label: "🍷 休闲娱乐",
    category: "game",
    templates: [
      { title: "周五微醺局 🍷", description: "找一家安静的speakeasy，两杯就打住，主要是认识新朋友。", tags: ["微醺", "夜猫子", "新人友好"] },
      { title: "桌游局 🎲", description: "狼人杀/阿瓦隆/卡坦岛，新手友好，会教的。", tags: ["纯聊天", "新人友好"] },
    ],
  },
  {
    label: "🚶 户外运动",
    category: "sport",
    templates: [
      { title: "周末 City Walk 🚶", description: "从学校出发沿湖走一圈，路过有意思的店就进去看看。慢节奏。", tags: ["citywalk", "探店", "i人友好"] },
      { title: "徒步搭子 🥾", description: "周末去附近国家公园徒步，大概3-4小时。需要基本装备。", tags: ["citywalk", "AA"] },
    ],
  },
];
