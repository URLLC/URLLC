"use client";

import { useEffect, useRef } from "react";
import type { SpotPin } from "@/lib/types";

export interface MapSession {
  id: string;
  title: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  creator?: { name?: string | null } | null;
}

interface FullMapProps {
  spots: SpotPin[];
  sessions?: MapSession[];
  center?: [number, number];
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character] || character);
}

export default function FullMap({ spots, sessions = [], center = [-35.2809, 149.13] }: FullMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      if (mapInstanceRef.current) mapInstanceRef.current.remove();

      const map = L.map(mapRef.current!, { center, zoom: 13 });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);

      const markerIcon = L.divIcon({
        className: "custom-marker",
        html: '<div style="background:#7C5FFF;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(124,95,255,.4);"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      spots.forEach((spot) => {
        L.marker([spot.latitude, spot.longitude], { icon: markerIcon })
          .addTo(map)
          .bindPopup(`<div style="font-family:system-ui,sans-serif;padding:4px;"><b>${escapeHtml(spot.title)}</b><br/><span style="font-size:12px;color:#78716c;">${escapeHtml(spot.user.name)} · ${escapeHtml(spot.location)}</span></div>`, { className: "custom-popup" });
      });

      sessions.filter((session) => session.latitude !== null && session.longitude !== null).forEach((session) => {
        L.marker([session.latitude!, session.longitude!], { icon: markerIcon })
          .addTo(map)
          .bindPopup(`<div style="font-family:system-ui,sans-serif;padding:4px;"><b>${escapeHtml(session.title)}</b><br/><span style="font-size:12px;color:#78716c;">${escapeHtml(session.creator?.name || "Dazi 用户")} · ${escapeHtml(session.location)}</span></div>`, { className: "custom-popup" });
      });

      if (sessions.length > 0) {
        const coordinates = sessions
          .filter((session) => session.latitude !== null && session.longitude !== null)
          .map((session) => [session.latitude!, session.longitude!] as [number, number]);
        if (coordinates.length) map.fitBounds(coordinates, { padding: [28, 28], maxZoom: 13 });
      }

      setTimeout(() => map.invalidateSize(), 100);
      mapInstanceRef.current = map;
    };

    initMap();
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [spots, sessions, center]);

  return <div ref={mapRef} className="h-full w-full" />;
}
