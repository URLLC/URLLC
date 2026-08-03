from __future__ import annotations

import json
import os
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from .core import Candidate


class MockProvider:
    def __init__(self, fixture: Path) -> None:
        self.data = json.loads(fixture.read_text(encoding="utf-8"))

    def search(self, name: str, city: str = "") -> list[Candidate]:
        return [Candidate(**item) for item in self.data.get(name, [])]


class AMapProvider:
    endpoint = "https://restapi.amap.com/v3/place/text"

    def __init__(self, api_key: str | None = None, timeout: int = 20) -> None:
        self.api_key = api_key or os.getenv("AMAP_API_KEY", "")
        self.timeout = timeout
        if not self.api_key:
            raise ValueError("Set AMAP_API_KEY or pass --amap-key")

    def search(self, name: str, city: str = "") -> list[Candidate]:
        params = {
            "key": self.api_key,
            "keywords": name,
            "city": city,
            "citylimit": "true" if city else "false",
            "offset": 10,
            "page": 1,
            "extensions": "base",
        }
        request = Request(f"{self.endpoint}?{urlencode(params)}", headers={"User-Agent": "ScenicGeoAuditor/0.1"})
        with urlopen(request, timeout=self.timeout) as response:
            payload = json.loads(response.read().decode("utf-8"))
        if payload.get("status") != "1":
            raise RuntimeError(payload.get("info") or "AMap API request failed")
        output: list[Candidate] = []
        for poi in payload.get("pois", []):
            location = str(poi.get("location") or "").split(",")
            if len(location) != 2:
                continue
            output.append(
                Candidate(
                    name=str(poi.get("name") or ""),
                    province=str(poi.get("pname") or ""),
                    city=str(poi.get("cityname") or ""),
                    lng=float(location[0]),
                    lat=float(location[1]),
                    poi_type=str(poi.get("type") or ""),
                    source="amap",
                )
            )
        return output

