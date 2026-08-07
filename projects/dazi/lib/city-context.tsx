"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { CityId } from "./types";

const CityContext = createContext<{
  city: CityId;
  setCity: (city: CityId) => void;
}>({ city: "canberra", setCity: () => {} });

export function CityProvider({ children }: { children: ReactNode }) {
  const [city, setCityState] = useState<CityId>("canberra");

  useEffect(() => {
    const saved = localStorage.getItem("dazi-city");
    if (saved) setCityState(saved as CityId);
  }, []);

  const setCity = (c: CityId) => {
    setCityState(c);
    localStorage.setItem("dazi-city", c);
  };

  return <CityContext.Provider value={{ city, setCity }}>{children}</CityContext.Provider>;
}

export function useCity() {
  return useContext(CityContext);
}
