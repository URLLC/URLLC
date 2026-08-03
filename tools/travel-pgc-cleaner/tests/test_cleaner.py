import unittest

from travel_pgc_cleaner.cleaner import clean_content, clean_image_urls


class CleanerTests(unittest.TestCase):
    def test_clean_content_removes_duplicates_and_boilerplate(self):
        raw = "<p>古镇河道两岸保留传统街巷。</p><p>古镇河道两岸保留传统街巷。</p><p>阅读原文</p>"
        self.assertEqual(clean_content(raw), "古镇河道两岸保留传统街巷。")

    def test_clean_image_urls_deduplicates_and_removes_qr(self):
        raw = "https://EXAMPLE.com/a.jpg?utm_source=x;https://example.com/a.jpg;https://example.com/qrcode.png"
        self.assertEqual(clean_image_urls(raw), ["https://example.com/a.jpg"])


if __name__ == "__main__":
    unittest.main()
