from __future__ import annotations

from dataclasses import dataclass
from difflib import SequenceMatcher
from math import asin, cos, radians, sin, sqrt


@dataclass(frozen=True)
class Candidate:
    name: str
    province: str
    city: str
    lng: float
    lat: float
    poi_type: str = ""
    source: str = ""


@dataclass(frozen=True)
class AuditResult:
    status: str
    score: float
    candidate: Candidate | None
    distance_km: float | None
    reason: str


def _norm(value: str) -> str:
    return "".join((value or "").lower().split())


def haversine_km(lng1: float, lat1: float, lng2: float, lat2: float) -> float:
    radius = 6371.0088
    d_lng = radians(lng2 - lng1)
    d_lat = radians(lat2 - lat1)
    a = sin(d_lat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(d_lng / 2) ** 2
    return 2 * radius * asin(sqrt(a))


def score_candidate(
    *,
    name: str,
    province: str,
    city: str,
    original_lng: float | None,
    original_lat: float | None,
    candidate: Candidate,
) -> tuple[float, float | None, list[str]]:
    reasons: list[str] = []
    score = SequenceMatcher(None, _norm(name), _norm(candidate.name)).ratio() * 30
    reasons.append(f"name={score:.1f}/30")

    if _norm(province) and _norm(province) == _norm(candidate.province):
        score += 25
        reasons.append("province=25/25")
    elif province:
        reasons.append("province=0/25")

    if _norm(city) and _norm(city) == _norm(candidate.city):
        score += 20
        reasons.append("city=20/20")
    elif city:
        reasons.append("city=0/20")

    distance: float | None = None
    if original_lng is not None and original_lat is not None:
        distance = haversine_km(original_lng, original_lat, candidate.lng, candidate.lat)
        if distance <= 1:
            distance_score = 20
        elif distance <= 5:
            distance_score = 16
        elif distance <= 20:
            distance_score = 10
        elif distance <= 50:
            distance_score = 4
        else:
            distance_score = 0
        score += distance_score
        reasons.append(f"distance={distance:.2f}km,{distance_score}/20")

    if any(token in candidate.poi_type for token in ("风景名胜", "旅游景点", "公园广场")):
        score += 5
        reasons.append("poi_type=5/5")

    return min(score, 100.0), distance, reasons


def audit_candidates(
    *,
    name: str,
    province: str,
    city: str,
    original_lng: float | None,
    original_lat: float | None,
    candidates: list[Candidate],
    auto_threshold: float = 75,
    review_threshold: float = 50,
) -> AuditResult:
    if not candidates:
        return AuditResult("not_found", 0.0, None, None, "no candidate")

    ranked: list[tuple[float, float | None, Candidate, list[str]]] = []
    for candidate in candidates:
        score, distance, reasons = score_candidate(
            name=name,
            province=province,
            city=city,
            original_lng=original_lng,
            original_lat=original_lat,
            candidate=candidate,
        )
        ranked.append((score, distance, candidate, reasons))

    ranked.sort(key=lambda item: item[0], reverse=True)
    score, distance, candidate, reasons = ranked[0]
    if score >= auto_threshold:
        status = "auto_pass"
    elif score >= review_threshold:
        status = "manual_review"
    else:
        status = "no_match"
    return AuditResult(status, round(score, 2), candidate, distance, "; ".join(reasons))

