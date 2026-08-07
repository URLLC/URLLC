import type { User, Session, SessionComment, VibeTagDef, City, ChatRequest, FollowUser } from "./types";

// ==================== Cities ====================
export const CITIES: City[] = [
  { id: "canberra", name: "堪培拉", country: "AU", center: [-35.2809, 149.13] },
  { id: "sydney", name: "悉尼", country: "AU", center: [-33.8688, 151.2093] },
  { id: "melbourne", name: "墨尔本", country: "AU", center: [-37.8136, 144.9631] },
  { id: "brisbane", name: "布里斯班", country: "AU", center: [-27.4698, 153.0251] },
  { id: "adelaide", name: "阿德莱德", country: "AU", center: [-34.9285, 138.6007] },
  { id: "perth", name: "珀斯", country: "AU", center: [-31.9505, 115.8605] },
  { id: "london", name: "伦敦", country: "UK", center: [51.5074, -0.1278] },
  { id: "manchester", name: "曼彻斯特", country: "UK", center: [53.4808, -2.2426] },
  { id: "birmingham", name: "伯明翰", country: "UK", center: [52.4862, -1.8904] },
  { id: "edinburgh", name: "爱丁堡", country: "UK", center: [55.9533, -3.1883] },
  { id: "leeds", name: "利兹", country: "UK", center: [53.8008, -1.5491] },
  { id: "glasgow", name: "格拉斯哥", country: "UK", center: [55.8642, -4.2518] },
];

// ==================== Vibe Tags ====================
export const VIBE_TAGS: VibeTagDef[] = [
  { name: "i人友好", type: "atmosphere", emoji: "🌿" },
  { name: "社恐友好", type: "atmosphere", emoji: "🐣" },
  { name: "新人友好", type: "atmosphere", emoji: "🤗" },
  { name: "微醺", type: "atmosphere", emoji: "🍷" },
  { name: "不喝酒", type: "atmosphere", emoji: "🧃" },
  { name: "夜猫子", type: "atmosphere", emoji: "🦉" },
  { name: "女生局", type: "atmosphere", emoji: "👯" },
  { name: "纯饭搭子", type: "scene", emoji: "🍜" },
  { name: "AA", type: "scene", emoji: "💰" },
  { name: "期末发疯", type: "scene", emoji: "📚" },
  { name: "citywalk", type: "scene", emoji: "🚶" },
  { name: "纯聊天", type: "scene", emoji: "💬" },
  { name: "探店", type: "scene", emoji: "🔍" },
];

// ==================== Users ====================
export const MOCK_USERS: User[] = [
  { id: "u1", name: "小糖", avatar: "", school: "ANU", grade: "Master 1", bio: "刚来堪培拉三个月，想多认识些朋友一起探索城市 🦘", vibeTags: ["i人友好", "探店", "纯饭搭子"], reputationScore: 4.8, showHistory: true, is_admin: false, createdAt: "2026-02-15T00:00:00Z" },
  { id: "u2", name: "Lucas", avatar: "", school: "ANU", grade: "Bachelor 3", bio: "在这边呆了两年了，可以带新人熟悉环境", vibeTags: ["新人友好", "citywalk", "AA"], reputationScore: 4.5, showHistory: true, is_admin: false, createdAt: "2025-07-10T00:00:00Z" },
  { id: "u3", name: "Yuki", avatar: "", school: "ANU", grade: "Master 2", bio: "期末发疯中，需要饭搭子续命 🍜", vibeTags: ["社恐友好", "期末发疯", "纯饭搭子", "夜猫子"], reputationScore: 4.9, showHistory: true, is_admin: false, createdAt: "2025-03-20T00:00:00Z" },
  { id: "u4", name: "阿杰", avatar: "", school: "UC", grade: "Bachelor 2", bio: "喜欢摄影和citywalk，周末一般都在外面溜达", vibeTags: ["citywalk", "探店", "i人友好"], reputationScore: 4.2, showHistory: true, is_admin: false, createdAt: "2025-11-05T00:00:00Z" },
  { id: "u5", name: "Mia", avatar: "", school: "ANU", grade: "Master 1", bio: "韩餐重度爱好者 🇰🇷 找女生饭搭子", vibeTags: ["女生局", "纯饭搭子", "探店", "不喝酒"], reputationScore: 5.0, showHistory: true, is_admin: false, createdAt: "2026-01-08T00:00:00Z" },
  { id: "u6", name: "Oliver", avatar: "", school: "USYD", grade: "Bachelor 2", bio: "悉尼探店达人，知道所有隐藏的小馆子 🔍", vibeTags: ["探店", "纯饭搭子", "新人友好"], reputationScore: 4.6, showHistory: true, is_admin: false, createdAt: "2025-06-15T00:00:00Z" },
  { id: "u7", name: "Ella", avatar: "", school: "KCL", grade: "Master 1", bio: "刚来伦敦，急需饭搭子和逛街搭子 🛍️", vibeTags: ["纯饭搭子", "citywalk", "社恐友好", "女生局"], reputationScore: 4.7, showHistory: true, is_admin: false, createdAt: "2026-03-01T00:00:00Z" },
  { id: "u8", name: "Alex", avatar: "", school: "UniMelb", grade: "Master 2", bio: "墨尔本老油条，带你发现最酷的咖啡店 ☕", vibeTags: ["探店", "citywalk", "微醺", "新人友好"], reputationScore: 4.4, showHistory: true, is_admin: false, createdAt: "2025-08-20T00:00:00Z" },
];

// ==================== Helpers ====================
function getTime(offsetHours: number): string {
  const d = new Date();
  d.setHours(d.getHours() + offsetHours);
  return d.toISOString();
}

const COVERS = [
  "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
];

// ==================== Sessions ====================
export const MOCK_SESSIONS: Session[] = [
  // Canberra
  { id: "s1", creatorId: "u3", creator: MOCK_USERS[2], title: "今晚 ANU 附近想吃韩餐，有没有逃避期末的人一起 🍜", description: "想去那家新开的 K-Town，一个人点不了太多菜。找个饭搭子AA，单纯干饭不尬聊。吃完饭各回各家复习。", location: "Canberra Centre", latitude: -35.2784, longitude: 149.1295, city: "canberra", startTime: getTime(3), maxPeople: 4, currentPeople: 2, status: "open", isPinned: true, coverImage: COVERS[0], tags: [{ id: "t1", tagName: "纯饭搭子", tagType: "scene" }, { id: "t2", tagName: "AA", tagType: "scene" }, { id: "t3", tagName: "i人友好", tagType: "atmosphere" }], members: [MOCK_USERS[2], MOCK_USERS[0]], createdAt: getTime(-5) },
  { id: "s2", creatorId: "u1", creator: MOCK_USERS[0], title: "周末 citywalk + 探店拍照，从 ANU 出发 📸", description: "从学校出发沿湖边走到National Museum，路过有意思的店就进去看看。主打一个慢节奏。", location: "ANU 正门口", latitude: -35.2777, longitude: 149.1185, city: "canberra", startTime: getTime(24), maxPeople: 6, currentPeople: 3, status: "open", isPinned: false, coverImage: COVERS[1], tags: [{ id: "t5", tagName: "citywalk", tagType: "scene" }, { id: "t6", tagName: "探店", tagType: "scene" }, { id: "t7", tagName: "新人友好", tagType: "atmosphere" }], members: [MOCK_USERS[0], MOCK_USERS[1], MOCK_USERS[3]], createdAt: getTime(-8) },
  { id: "s5", creatorId: "u3", creator: MOCK_USERS[2], title: "ANU 图书馆学习搭子 📚", description: "Chifley Library 三楼，一起学但不一定学一样的。主要是监督别摸鱼。", location: "Chifley Library, ANU", latitude: -35.2809, longitude: 149.1200, city: "canberra", startTime: getTime(6), maxPeople: 4, currentPeople: 2, status: "open", isPinned: false, coverImage: COVERS[4], tags: [{ id: "t13", tagName: "期末发疯", tagType: "scene" }, { id: "t14", tagName: "i人友好", tagType: "atmosphere" }], members: [MOCK_USERS[2], MOCK_USERS[1]], createdAt: getTime(-2) },
  // Sydney
  { id: "s6", creatorId: "u6", creator: MOCK_USERS[5], title: "悉尼 Surry Hills 隐藏咖啡馆巡礼 ☕", description: "带你探5家本地人才知道的咖啡馆，适合拍照聊天。", location: "Surry Hills, Sydney", latitude: -33.8860, longitude: 151.2115, city: "sydney", startTime: getTime(20), maxPeople: 4, currentPeople: 2, status: "open", isPinned: true, coverImage: COVERS[6], tags: [{ id: "t20", tagName: "探店", tagType: "scene" }, { id: "t21", tagName: "纯聊天", tagType: "scene" }, { id: "t22", tagName: "新人友好", tagType: "atmosphere" }], members: [MOCK_USERS[5], MOCK_USERS[2]], createdAt: getTime(-10) },
  { id: "s7", creatorId: "u6", creator: MOCK_USERS[5], title: "Bondi Beach 周末 brunch + 徒步 🏖️", description: "从Bondi到Coogee的经典海岸线徒步，中间找个cafe吃brunch。", location: "Bondi Beach, Sydney", latitude: -33.8915, longitude: 151.2767, city: "sydney", startTime: getTime(48), maxPeople: 6, currentPeople: 3, status: "open", isPinned: false, coverImage: COVERS[7], tags: [{ id: "t30", tagName: "citywalk", tagType: "scene" }, { id: "t31", tagName: "探店", tagType: "scene" }], members: [MOCK_USERS[5], MOCK_USERS[0], MOCK_USERS[3]], createdAt: getTime(-15) },
  // Melbourne
  { id: "s8", creatorId: "u8", creator: MOCK_USERS[7], title: "墨尔本巷弄咖啡 + 涂鸦街拍照 📸", description: "Fitzroy 和 Collingwood 的隐藏巷弄，拍照打卡+咖啡爱好者必来。", location: "Fitzroy, Melbourne", latitude: -37.8013, longitude: 144.9789, city: "melbourne", startTime: getTime(30), maxPeople: 5, currentPeople: 3, status: "open", isPinned: true, coverImage: COVERS[8], tags: [{ id: "t40", tagName: "探店", tagType: "scene" }, { id: "t41", tagName: "citywalk", tagType: "scene" }], members: [MOCK_USERS[7], MOCK_USERS[1], MOCK_USERS[5]], createdAt: getTime(-12) },
  { id: "s9", creatorId: "u8", creator: MOCK_USERS[7], title: "维妈夜市 + 微醺局 🍷", description: "Queen Victoria Market 夏季夜市，吃各种小吃然后去旁边小酒吧。", location: "Queen Victoria Market", latitude: -37.8071, longitude: 144.9567, city: "melbourne", startTime: getTime(72), maxPeople: 6, currentPeople: 4, status: "open", isPinned: false, coverImage: COVERS[9], tags: [{ id: "t50", tagName: "微醺", tagType: "atmosphere" }, { id: "t51", tagName: "纯饭搭子", tagType: "scene" }, { id: "t52", tagName: "夜猫子", tagType: "atmosphere" }], members: [MOCK_USERS[7], MOCK_USERS[2], MOCK_USERS[0], MOCK_USERS[5]], createdAt: getTime(-20) },
  // Brisbane
  { id: "s10", creatorId: "u4", creator: MOCK_USERS[3], title: "South Bank 河边 BBQ 局 🥩", description: "自带食材，AA制，在South Bank的免费BBQ区域搞一个周末烧烤。", location: "South Bank, Brisbane", latitude: -27.4780, longitude: 153.0220, city: "brisbane", startTime: getTime(60), maxPeople: 8, currentPeople: 5, status: "open", isPinned: true, coverImage: COVERS[2], tags: [{ id: "t60", tagName: "纯饭搭子", tagType: "scene" }, { id: "t61", tagName: "AA", tagType: "scene" }, { id: "t62", tagName: "新人友好", tagType: "atmosphere" }], members: [MOCK_USERS[3], MOCK_USERS[1], MOCK_USERS[6], MOCK_USERS[5], MOCK_USERS[7]], createdAt: getTime(-6) },
  // London
  { id: "s11", creatorId: "u7", creator: MOCK_USERS[6], title: "伦敦中国城火锅局 🔥", description: "想念火锅的第N天，找几个也在伦敦的搭子一起去蜀香阁。", location: "Chinatown, London", latitude: 51.5114, longitude: -0.1307, city: "london", startTime: getTime(24), maxPeople: 4, currentPeople: 2, status: "open", isPinned: true, coverImage: COVERS[10], tags: [{ id: "t70", tagName: "纯饭搭子", tagType: "scene" }, { id: "t71", tagName: "AA", tagType: "scene" }, { id: "t72", tagName: "女生局", tagType: "atmosphere" }], members: [MOCK_USERS[6], MOCK_USERS[4]], createdAt: getTime(-4) },
  { id: "s12", creatorId: "u7", creator: MOCK_USERS[6], title: "大英博物馆 + 下午茶 🫖", description: "周六下午逛博物馆，然后去附近找个英式下午茶。适合刚来伦敦的新人。", location: "British Museum", latitude: 51.5194, longitude: -0.1270, city: "london", startTime: getTime(44), maxPeople: 4, currentPeople: 2, status: "open", isPinned: false, coverImage: COVERS[11], tags: [{ id: "t80", tagName: "citywalk", tagType: "scene" }, { id: "t81", tagName: "新人友好", tagType: "atmosphere" }, { id: "t82", tagName: "探店", tagType: "scene" }], members: [MOCK_USERS[6], MOCK_USERS[2]], createdAt: getTime(-3) },
  { id: "s13", creatorId: "u7", creator: MOCK_USERS[6], title: "Camden Market 淘货 + 街头小吃 🎸", description: "Camden Town 周末逛市集淘Vintage，饿了就吃街头小吃。", location: "Camden Market, London", latitude: 51.5413, longitude: -0.1475, city: "london", startTime: getTime(68), maxPeople: 5, currentPeople: 3, status: "open", isPinned: false, coverImage: COVERS[3], tags: [{ id: "t90", tagName: "探店", tagType: "scene" }, { id: "t91", tagName: "纯聊天", tagType: "scene" }], members: [MOCK_USERS[6], MOCK_USERS[0], MOCK_USERS[5]], createdAt: getTime(-1) },
  // Manchester
  { id: "s14", creatorId: "u6", creator: MOCK_USERS[5], title: "曼城 Northern Quarter 酒吧巡游 🍺", description: "NQ 区独立酒吧一家接一家，每家喝一杯，认识新朋友。", location: "Northern Quarter, Manchester", latitude: 53.4823, longitude: -2.2364, city: "manchester", startTime: getTime(50), maxPeople: 6, currentPeople: 3, status: "open", isPinned: true, coverImage: COVERS[8], tags: [{ id: "t100", tagName: "微醺", tagType: "atmosphere" }, { id: "t101", tagName: "夜猫子", tagType: "atmosphere" }, { id: "t102", tagName: "新人友好", tagType: "atmosphere" }], members: [MOCK_USERS[5], MOCK_USERS[1], MOCK_USERS[7]], createdAt: getTime(-7) },
  // Edinburgh
  { id: "s15", creatorId: "u8", creator: MOCK_USERS[7], title: "爱丁堡老城幽灵之旅 👻", description: "晚上走老城小巷听鬼故事，适合喜欢猎奇的搭子。", location: "Royal Mile, Edinburgh", latitude: 55.9502, longitude: -3.1860, city: "edinburgh", startTime: getTime(40), maxPeople: 5, currentPeople: 2, status: "open", isPinned: false, coverImage: COVERS[4], tags: [{ id: "t110", tagName: "citywalk", tagType: "scene" }, { id: "t111", tagName: "纯聊天", tagType: "scene" }], members: [MOCK_USERS[7], MOCK_USERS[6]], createdAt: getTime(-9) },
];

// ==================== Comments ====================
export const MOCK_COMMENTS: SessionComment[] = [
  { id: "c1", sessionId: "s1", user: MOCK_USERS[0], content: "氛围很好，大家都不尬聊，就是纯干饭。适合社恐人士！", createdAt: getTime(-2) },
  { id: "c2", sessionId: "s1", user: MOCK_USERS[2], content: "第二次参加这种局了，比想象中舒服很多。", createdAt: getTime(-1) },
  { id: "c3", sessionId: "s11", user: MOCK_USERS[4], content: "好久没吃火锅了，这个局简直是救命局！", createdAt: getTime(-1) },
];

// ==================== Chat Requests ====================
export const MOCK_CHAT_REQUESTS: ChatRequest[] = [
  { id: "cr1", sessionId: "s1", sessionTitle: "今晚 ANU 韩餐局 🍜", fromUser: MOCK_USERS[2], status: "accepted", createdAt: getTime(-1) },
  { id: "cr2", sessionId: "s4", sessionTitle: "周五酒吧微醺局 🍷", fromUser: MOCK_USERS[1], status: "pending", createdAt: getTime(-3) },
  { id: "cr3", sessionId: "s8", sessionTitle: "墨尔本巷弄咖啡 📸", fromUser: MOCK_USERS[7], status: "accepted", createdAt: getTime(-5) },
  { id: "cr4", sessionId: "s11", sessionTitle: "伦敦火锅局 🔥", fromUser: MOCK_USERS[6], status: "pending", createdAt: getTime(-6) },
];

// ==================== Follows ====================
export const MOCK_FOLLOWS: FollowUser[] = [
  { user: MOCK_USERS[2], followedAt: getTime(-100) },
  { user: MOCK_USERS[4], followedAt: getTime(-80) },
  { user: MOCK_USERS[1], followedAt: getTime(-50) },
  { user: MOCK_USERS[6], followedAt: getTime(-20) },
];

// ==================== Community Stats (per city) ====================
export const COMMUNITY_STATS: Record<string, { sessions: number; participants: number; newUsers: number }> = {
  canberra: { sessions: 8, participants: 18, newUsers: 3 },
  sydney: { sessions: 5, participants: 12, newUsers: 2 },
  melbourne: { sessions: 6, participants: 15, newUsers: 4 },
  brisbane: { sessions: 3, participants: 8, newUsers: 1 },
  adelaide: { sessions: 2, participants: 5, newUsers: 0 },
  perth: { sessions: 2, participants: 4, newUsers: 1 },
  london: { sessions: 7, participants: 20, newUsers: 5 },
  manchester: { sessions: 3, participants: 8, newUsers: 2 },
  birmingham: { sessions: 2, participants: 5, newUsers: 1 },
  edinburgh: { sessions: 2, participants: 4, newUsers: 1 },
  leeds: { sessions: 1, participants: 3, newUsers: 0 },
  glasgow: { sessions: 1, participants: 2, newUsers: 1 },
};
