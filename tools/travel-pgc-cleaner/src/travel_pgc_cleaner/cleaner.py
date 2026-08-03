from __future__ import annotations

import html
import re
from html.parser import HTMLParser
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit


BOILERPLATE_PATTERNS = (
    r"^点击(?:上方|下方).*$",
    r"^长按识别二维码.*$",
    r"^关注(?:我们|公众号).*$",
    r"^阅读原文$",
    r"^免责声明.*$",
)


class _TextExtractor(HTMLParser):
    BLOCK_TAGS = {"p", "div", "section", "article", "li", "br", "h1", "h2", "h3"}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []
        self._ignored_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in {"script", "style", "noscript"}:
            self._ignored_depth += 1
        elif not self._ignored_depth and tag in self.BLOCK_TAGS:
            self.parts.append("\n")

    def handle_endtag(self, tag: str) -> None:
        if tag in {"script", "style", "noscript"} and self._ignored_depth:
            self._ignored_depth -= 1
        elif not self._ignored_depth and tag in self.BLOCK_TAGS:
            self.parts.append("\n")

    def handle_data(self, data: str) -> None:
        if not self._ignored_depth:
            self.parts.append(data)


def html_to_text(value: str) -> str:
    parser = _TextExtractor()
    parser.feed(value or "")
    parser.close()
    return html.unescape("".join(parser.parts))


def _normalize_line(line: str) -> str:
    line = line.replace("\u3000", " ").replace("\xa0", " ")
    return re.sub(r"[ \t]+", " ", line).strip()


def clean_content(value: str, min_line_length: int = 2) -> str:
    """Convert HTML/plain text into deduplicated, readable paragraphs."""
    text = html_to_text(value) if re.search(r"<[^>]+>", value or "") else html.unescape(value or "")
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    lines: list[str] = []
    seen: set[str] = set()
    for raw in text.split("\n"):
        line = _normalize_line(raw)
        if len(line) < min_line_length:
            continue
        if any(re.match(pattern, line, flags=re.IGNORECASE) for pattern in BOILERPLATE_PATTERNS):
            continue
        fingerprint = re.sub(r"\s+", "", line).lower()
        if fingerprint in seen:
            continue
        seen.add(fingerprint)
        lines.append(line)
    return "\n\n".join(lines)


def canonicalize_url(url: str) -> str:
    url = (url or "").strip()
    if not url:
        return ""
    split = urlsplit(url)
    if split.scheme not in {"http", "https"}:
        return ""
    blocked = {"utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "spm"}
    query = [(k, v) for k, v in parse_qsl(split.query, keep_blank_values=True) if k.lower() not in blocked]
    return urlunsplit((split.scheme.lower(), split.netloc.lower(), split.path, urlencode(query), ""))


def clean_image_urls(value: str | list[str]) -> list[str]:
    """Normalize image URLs, remove tracking parameters, QR-like names and duplicates."""
    items = value if isinstance(value, list) else re.split(r"[,;\n|]+", value or "")
    output: list[str] = []
    seen: set[str] = set()
    for item in items:
        cleaned = canonicalize_url(item)
        if not cleaned:
            continue
        lowered = cleaned.lower()
        if any(token in lowered for token in ("qrcode", "qr_code", "/qr/", "weixin_code")):
            continue
        if cleaned in seen:
            continue
        seen.add(cleaned)
        output.append(cleaned)
    return output

