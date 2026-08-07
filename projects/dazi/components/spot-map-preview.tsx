"use client";

import { useEffect, useRef } from "react";
import type { Session } from "@/lib/types";

interface SpotMapPreviewProps {
  sessions: Session[];
}

export default function SpotMapPreview({ sessions }: SpotMapPreviewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const center = sessions[0]
        ? [sessions[0].latitude, sessions[0].longitude]
        : [-35.2809, 149.13];

      const map = L.map(mapRef.current!, {
        center: center as [number, number],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      const warmIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="background:#7C5FFF;width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(124,95,255,0.4);"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });

      sessions.forEach((session) => {
        const marker = L.marker([session.latitude, session.longitude], { icon: warmIcon }).addTo(map);
        marker.bindTooltip(session.title, {
          direction: "top",
          offset: [0, -8],
          className: "custom-tooltip",
        });
      });

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
  }, [sessions]);

  return <div ref={mapRef} className="h-full w-full" />;
}
