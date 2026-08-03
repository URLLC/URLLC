from __future__ import annotations

import argparse
import csv
from pathlib import Path

from .core import audit_candidates
from .providers import AMapProvider, MockProvider


def _optional_float(value: str) -> float | None:
    value = (value or "").strip()
    return float(value) if value else None


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Audit scenic-area coordinates")
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--provider", choices=("mock", "amap"), default="mock")
    parser.add_argument("--fixture", type=Path, help="Mock candidate JSON")
    parser.add_argument("--amap-key", help="AMap key; prefer AMAP_API_KEY environment variable")
    parser.add_argument("--auto-threshold", type=float, default=75)
    parser.add_argument("--review-threshold", type=float, default=50)
    return parser


def main() -> None:
    args = build_parser().parse_args()
    if args.provider == "mock":
        if not args.fixture:
            raise SystemExit("--fixture is required for mock provider")
        provider = MockProvider(args.fixture)
    else:
        provider = AMapProvider(args.amap_key)

    with args.input.open("r", encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.DictReader(handle))
    output: list[dict[str, str]] = []
    for row in rows:
        result = audit_candidates(
            name=row.get("name", ""),
            province=row.get("province", ""),
            city=row.get("city", ""),
            original_lng=_optional_float(row.get("lng", "")),
            original_lat=_optional_float(row.get("lat", "")),
            candidates=provider.search(row.get("name", ""), row.get("city", "")),
            auto_threshold=args.auto_threshold,
            review_threshold=args.review_threshold,
        )
        candidate = result.candidate
        output.append(
            {
                **row,
                "audit_status": result.status,
                "score": str(result.score),
                "candidate_name": candidate.name if candidate else "",
                "candidate_lng": str(candidate.lng) if candidate else "",
                "candidate_lat": str(candidate.lat) if candidate else "",
                "distance_km": f"{result.distance_km:.3f}" if result.distance_km is not None else "",
                "reason": result.reason,
            }
        )

    args.output.parent.mkdir(parents=True, exist_ok=True)
    if not output:
        raise SystemExit("No input rows")
    with args.output.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(output[0].keys()))
        writer.writeheader()
        writer.writerows(output)
    print(f"Audited {len(output)} row(s) -> {args.output}")


if __name__ == "__main__":
    main()

