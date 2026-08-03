from __future__ import annotations

import argparse
import json
from pathlib import Path
from urllib.request import Request, urlopen

from .cleaner import clean_content, clean_image_urls
from .io_utils import read_rows, write_rows


def fetch_text(url: str, timeout: int = 20) -> str:
    request = Request(url, headers={"User-Agent": "Mozilla/5.0 TravelPGCCleaner/0.1"})
    with urlopen(request, timeout=timeout) as response:
        charset = response.headers.get_content_charset() or "utf-8"
        return response.read().decode(charset, errors="replace")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Clean travel PGC content in CSV/XLSX batches")
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--fetch", action="store_true", help="Fetch URL when raw_content is empty")
    parser.add_argument("--state", type=Path, help="Optional JSON checkpoint file")
    return parser


def main() -> None:
    args = build_parser().parse_args()
    rows = read_rows(args.input)
    completed: set[str] = set()
    if args.state and args.state.exists():
        completed = set(json.loads(args.state.read_text(encoding="utf-8")).get("completed", []))

    output: list[dict[str, str]] = []
    for index, row in enumerate(rows, start=1):
        row_id = str(row.get("id") or index)
        if row_id in completed:
            continue
        record = dict(row)
        try:
            raw = row.get("raw_content", "")
            if not raw and args.fetch and row.get("url"):
                raw = fetch_text(row["url"])
            record["clean_content"] = clean_content(raw)
            record["clean_images"] = "\n".join(clean_image_urls(row.get("image_urls", "")))
            record["status"] = "ok" if record["clean_content"] else "empty"
            record["error"] = ""
        except Exception as exc:
            record["clean_content"] = ""
            record["clean_images"] = ""
            record["status"] = "failed"
            record["error"] = str(exc)
        output.append(record)
        completed.add(row_id)
        if args.state:
            args.state.parent.mkdir(parents=True, exist_ok=True)
            args.state.write_text(
                json.dumps({"completed": sorted(completed)}, ensure_ascii=False, indent=2),
                encoding="utf-8",
            )

    write_rows(args.output, output)
    print(f"Processed {len(output)} row(s) -> {args.output}")


if __name__ == "__main__":
    main()

