import importlib.util
import unittest
from pathlib import Path


MODULE_PATH = Path(__file__).parents[1] / "tools" / "build_prompt_pack.py"
SPEC = importlib.util.spec_from_file_location("build_prompt_pack", MODULE_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC and SPEC.loader
SPEC.loader.exec_module(MODULE)


class PromptPackTests(unittest.TestCase):
    def test_builds_eight_distinct_prompts(self):
        result = MODULE.build_prompt_pack(
            {
                "attraction": "示例古镇",
                "city": "示例市",
                "season": "春季",
                "features": ["河道", "石桥", "街巷"],
            }
        )
        self.assertEqual(len(result["prompts"]), 8)
        self.assertEqual(len({item["label"] for item in result["prompts"]}), 8)
        self.assertTrue(all("no QR code" in item["prompt"] for item in result["prompts"]))

    def test_requires_features(self):
        with self.assertRaises(ValueError):
            MODULE.build_prompt_pack({"attraction": "示例古镇", "features": []})


if __name__ == "__main__":
    unittest.main()

