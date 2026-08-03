from __future__ import annotations

import json
import re
import sys
from pathlib import Path


SECRET_PATTERNS = (
    r"\bsk-[A-Za-z0-9_-]{16,}\b",
    r"api[_-]?key\s*[:=]\s*[\"']?[^\"'\s]{12,}",
    r"token\s*[:=]\s*[\"']?[^\"'\s]{12,}",
)


def validate(path: Path) -> list[str]:
    raw = path.read_text(encoding="utf-8")
    errors: list[str] = []
    for pattern in SECRET_PATTERNS:
        if re.search(pattern, raw, flags=re.IGNORECASE):
            errors.append(f"possible secret matched: {pattern}")
    data = json.loads(raw)
    node_ids = [node["id"] for node in data.get("nodes", [])]
    if len(node_ids) != len(set(node_ids)):
        errors.append("node ids must be unique")
    known = set(node_ids)
    for source, target in data.get("connections", []):
        if source not in known or target not in known:
            errors.append(f"unknown connection: {source} -> {target}")
    image_nodes = [node for node in data.get("nodes", []) if node.get("type") == "image_generation"]
    if len(image_nodes) != 8:
        errors.append(f"expected 8 image-generation nodes, found {len(image_nodes)}")
    return errors


def main() -> None:
    path = Path(sys.argv[1] if len(sys.argv) > 1 else "workflow/workflow.json")
    errors = validate(path)
    if errors:
        print("\n".join(errors))
        raise SystemExit(1)
    print(f"Workflow OK: {path}")


if __name__ == "__main__":
    main()

