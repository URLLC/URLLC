"use client";

import { useEffect, useRef } from "react";

interface SessionMapProps {
  latitude: number;
  longitude: number;
  location: string;
}

export default function SessionMap({ latitude, longitude, location }: SessionMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      if (mapInstanceRef.current) mapInstanceRef.current.remove();

      const map = L.map(mapRef.current!, {
        center: [latitude, longitude],
        zoom: 15,
        zoomControl: false,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      const markerIcon = L.divIcon({
        className: "custom-marker",
        html: `<div style="background:#7C5FFF;width:24px;height:24px;border-radius:50%;border:4px solid white;box-shadow:0 2px 8px rgba(124,95,255,0.4);display:flex;align-items:center;justify-content:center;"><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="6"/></svg></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker([latitude, longitude], { icon: markerIcon })
        .addTo(map)
        .bindPopup(`<b>${location}</b>`, { className: "custom-popup" })
        .openPopup();

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
  }, [latitude, longitude, location]);

  return <div ref={mapRef} className="h-full w-full" />;
}
