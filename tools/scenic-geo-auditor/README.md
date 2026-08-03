# scenic-geo-auditor

一个面向景区、景点和公共服务点位的坐标核验工具。它把候选检索、名称相似度、行政区一致性、原坐标距离和 POI 类型组合为可解释评分，并将结果分流为自动通过、人工复核、无匹配或未找到。

仓库只包含模拟点位。高德 API Key 必须通过环境变量或命令行传入。

## 运行演示

```bash
set PYTHONPATH=src
python -m scenic_geo_auditor.cli ^
  --input examples/sample_input.csv ^
  --output output/audited.csv ^
  --provider mock ^
  --fixture examples/mock_candidates.json
```

演示模式不联网、不需要 API Key。

## 使用高德 API

```bash
set AMAP_API_KEY=your_key_here
python -m scenic_geo_auditor.cli ^
  --input input.csv ^
  --output output/audited.csv ^
  --provider amap
```

不要把真实 Key 写入代码或提交到 GitHub。

## 输入字段

| 字段 | 说明 |
| --- | --- |
| name | 景区或点位名称 |
| province | 省级行政区 |
| city | 城市 |
| lng / lat | 原始 GCJ-02 坐标，可留空 |

## 评分逻辑

- 名称相似度：30 分
- 省份一致：25 分
- 城市一致：20 分
- 与原坐标的距离：20 分
- 旅游相关 POI 类型：5 分

默认分流：

- `auto_pass`：总分不低于 75
- `manual_review`：总分 50–74.99
- `no_match`：存在候选但得分不足
- `not_found`：没有候选

阈值可通过 `--auto-threshold` 和 `--review-threshold` 调整。

## 测试

```bash
set PYTHONPATH=src
python -m unittest discover -s tests -v
```

## 数据安全

- 示例数据均为虚构数据。
- 不提交 API Key、真实客户坐标、人工复核记录、缓存和运行日志。
- 公开仓库只描述通用方法，不包含原始业务口径或公司内部结果。

