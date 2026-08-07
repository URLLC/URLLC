"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, ChevronDown, Check, Plus, Sparkles, MessageCircle, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CITIES } from "@/lib/mock-data";
import { useCity } from "@/lib/city-context";
import { useAuth } from "@/lib/auth-context";
import type { CityId, City } from "@/lib/types";

export function Navbar() {
  const pathname = usePathname();
  const { city: selectedCity, setCity: onCityChange } = useCity();
  const { user, loading } = useAuth();
  const [cityPickerOpen, setCityPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) setCityPickerOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const currentCity = CITIES.find((c) => c.id === selectedCity) || CITIES[0];
  const auCities = CITIES.filter((c) => c.country === "AU");
  const ukCities = CITIES.filter((c) => c.country === "UK");

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/80 shadow-[0_1px_0_rgba(30,27,46,.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-18 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg shadow-purple-200"><Sparkles className="h-4 w-4" /></span>
          <span className="text-xl font-black tracking-tight text-gray-950">Dazi<span className="text-purple-500">.</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          {[{ href: "/", label: "发现" }, { href: "/spots", label: "地图" }, { href: "/messages", label: "消息" }].map((item) => (
            <Link key={item.href} href={item.href} className={`px-3.5 py-2 rounded-xl font-medium transition-colors ${pathname === item.href ? "bg-purple-50 text-purple-700" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}>{item.label}</Link>
          ))}
        </nav>

        <div ref={pickerRef} className="relative md:ml-auto">
          <button onClick={() => setCityPickerOpen(!cityPickerOpen)} className="flex items-center gap-1 text-sm font-medium text-gray-800">
            <MapPin className="h-4 w-4 text-purple-500" />
            <span>{currentCity.name}</span>
            <ChevronDown className="h-3 w-3 text-gray-400" />
          </button>
          {cityPickerOpen && (
            <CityPicker auCities={auCities} ukCities={ukCities} selectedCity={selectedCity} onSelect={(id) => { onCityChange(id); setCityPickerOpen(false); }} />
          )}
        </div>
        <div className="ml-auto md:ml-0 flex items-center gap-2">
          <Link href="/session/new" className="hidden sm:flex h-10 items-center gap-2 rounded-xl bg-gray-950 px-4 text-sm font-semibold text-white hover:bg-purple-600 transition-colors shadow-sm"><Plus className="h-4 w-4" /> 发起活动</Link>
          <Link href="/messages" className="grid h-10 w-10 place-items-center rounded-xl text-gray-600 transition hover:bg-gray-50 hover:text-purple-700" aria-label="联系申请"><MessageCircle className="h-5 w-5" /></Link>
          {!loading && (user ? <Link href={`/user/${user.id}`} className="grid h-10 w-10 place-items-center rounded-xl bg-purple-50 text-purple-700 transition hover:bg-purple-100" aria-label="我的主页"><UserRound className="h-5 w-5" /></Link> : <Link href="/login" className="hidden sm:inline-flex h-10 items-center rounded-xl border border-gray-200 px-3.5 text-sm font-semibold text-gray-700 transition hover:border-purple-300 hover:text-purple-700">登录</Link>)}
        </div>
      </div>
    </header>
  );
}

function CityPicker({ auCities, ukCities, selectedCity, onSelect }: { auCities: City[]; ukCities: City[]; selectedCity: CityId; onSelect: (id: CityId) => void }) {
  return (
    <div className="absolute top-full mt-2 left-0 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 max-h-80 overflow-y-auto">
      <p className="text-[10px] text-gray-400 px-3 py-1 uppercase tracking-wider">🇦🇺 澳洲</p>
      {auCities.map((c) => (
        <button key={c.id} onClick={() => onSelect(c.id)} className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm hover:bg-purple-50 transition-colors">
          <span className={c.id === selectedCity ? "text-purple-600 font-medium" : "text-gray-700"}>{c.name}</span>
          {c.id === selectedCity && <Check className="h-4 w-4 text-purple-500" />}
        </button>
      ))}
      <div className="border-t border-gray-50 my-1" />
      <p className="text-[10px] text-gray-400 px-3 py-1 uppercase tracking-wider">🇬🇧 英国</p>
      {ukCities.map((c) => (
        <button key={c.id} onClick={() => onSelect(c.id)} className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm hover:bg-purple-50 transition-colors">
          <span className={c.id === selectedCity ? "text-purple-600 font-medium" : "text-gray-700"}>{c.name}</span>
          {c.id === selectedCity && <Check className="h-4 w-4 text-purple-500" />}
        </button>
      ))}
    </div>
  );
}
