"use client";

import { useEffect, useRef } from "react";
import type { Session } from "@/lib/types";

interface MiniMapProps {
  sessions: Session[];
}

export default function MiniMap({ sessions }: MiniMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      if (mapInstanceRef.current) mapInstanceRef.current.remove();

      const map = L.map(mapRef.current!, {
        center: [-35.2809, 149.13],
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);

      sessions.forEach((s) => {
        const icon = L.divIcon({
          className: "custom-marker",
          html: `<div style="background:#7C5FFF;width:10px;height:10px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(124,95,255,0.4);"></div>`,
          iconSize: [10, 10],
          iconAnchor: [5, 5],
        });
        L.marker([s.latitude, s.longitude], { icon }).addTo(map);
      });

      setTimeout(() => map.invalidateSize(), 100);
      mapInstanceRef.current = map;
    };

    initMap();
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, [sessions]);

  return <div ref={mapRef} className="h-full w-full" />;
}
