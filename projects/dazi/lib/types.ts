export interface User {
  id: string;
  name: string;
  avatar: string;
  school: string;
  grade: string;
  bio: string;
  vibeTags: string[];
  reputationScore: number;
  showHistory: boolean;
  is_admin: boolean;
  createdAt: string;
}

export interface Session {
  id: string;
  creatorId: string;
  creator: User;
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  city: string;
  startTime: string;
  maxPeople: number;
  currentPeople: number;
  status: "open" | "full" | "closed" | "ended";
  isPinned: boolean;
  coverImage: string;
  tags: SessionTag[];
  members: User[];
  createdAt: string;
}

export interface SessionTag {
  id: string;
  tagName: string;
  tagType: "atmosphere" | "scene";
}

export interface SessionComment {
  id: string;
  sessionId: string;
  user: User;
  content: string;
  createdAt: string;
}

export interface ChatRequest {
  id: string;
  sessionId: string;
  sessionTitle: string;
  fromUser: User;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export interface FollowUser {
  user: User;
  followedAt: string;
}

export type SortMode = "latest" | "popular";
export type CityId = string;

export interface City {
  id: CityId;
  name: string;
  country: "AU" | "UK";
  center: [number, number];
}

export interface SpotPin {
  id: string;
  user: User;
  location: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  vibeTags: string[];
  createdAt: string;
}

export interface VibeTagDef {
  name: string;
  type: "atmosphere" | "scene";
  emoji: string;
}
