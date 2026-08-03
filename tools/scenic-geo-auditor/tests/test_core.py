import unittest

from scenic_geo_auditor.core import Candidate, audit_candidates, haversine_km


class CoreTests(unittest.TestCase):
    def test_haversine_zero(self):
        self.assertEqual(haversine_km(120, 30, 120, 30), 0)

    def test_exact_candidate_auto_passes(self):
        result = audit_candidates(
            name="示例古镇",
            province="浙江省",
            city="杭州市",
            original_lng=120.0,
            original_lat=30.0,
            candidates=[
                Candidate("示例古镇", "浙江省", "杭州市", 120.001, 30.001, "风景名胜")
            ],
        )
        self.assertEqual(result.status, "auto_pass")
        self.assertGreaterEqual(result.score, 75)

    def test_empty_candidates_not_found(self):
        result = audit_candidates(
            name="不存在",
            province="江苏省",
            city="南京市",
            original_lng=None,
            original_lat=None,
            candidates=[],
        )
        self.assertEqual(result.status, "not_found")


if __name__ == "__main__":
    unittest.main()

