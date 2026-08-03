from __future__ import annotations

import argparse
import json
from pathlib import Path


STYLES = [
    ("自然风光", "wide landscape, natural light, realistic travel photography"),
    ("人文纪实", "documentary photography, local life, authentic atmosphere"),
    ("晨景", "early morning, soft sunrise, light mist"),
    ("夜景", "blue hour, warm architectural lights, cinematic night scene"),
    ("航拍", "aerial view, clear spatial structure, destination overview"),
    ("近景细节", "close-up detail, local texture, shallow depth of field"),
    ("节气氛围", "seasonal atmosphere, weather-appropriate scenery, editorial travel image"),
    ("旅行卡片", "mobile travel recommendation card, clean composition, room for title text")
]


def build_prompt_pack(payload: dict[str, object]) -> dict[str, object]:
    attraction = str(payload.get("attraction") or "").strip()
    if not attraction:
        raise ValueError("attraction is required")
    city = str(payload.get("city") or "").strip()
    features = [str(item).strip() for item in payload.get("features", []) if str(item).strip()]
    if not features:
        raise ValueError("features must contain at least one item")
    season = str(payload.get("season") or "当前季节").strip()
    location = f"{city} {attraction}".strip()
    feature_text = "、".join(features[:3])
    prompts = []
    for index, (label, style) in enumerate(STYLES, start=1):
        prompts.append(
            {
                "id": index,
                "label": label,
                "prompt": (
                    f"{location}，{season}，重点呈现{feature_text}；{style}; "
                    "no logo, no watermark, no QR code, no unreadable text, realistic details"
                ),
            }
        )
    return {
        "attraction": attraction,
        "main_title": attraction,
        "subtitle": feature_text[:18],
        "prompts": prompts,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Build eight travel image prompts")
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    payload = json.loads(args.input.read_text(encoding="utf-8"))
    result = build_prompt_pack(payload)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Generated {len(result['prompts'])} prompt(s) -> {args.output}")


if __name__ == "__main__":
    main()

