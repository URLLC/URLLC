# travel-pgc-cleaner

一个可公开运行的旅游 PGC 批处理工具：从 CSV 或 Excel 读取内容，完成正文清洗、段落去重、营销尾注过滤、图片链接去重，并输出可复核的处理结果。

这个仓库使用模拟数据，不包含任何公司文件、客户数据、浏览器配置或 API Key。

## 功能

- 支持 CSV；安装可选依赖后支持 XLSX
- HTML 转正文、空白规范化、重复段落清理
- 过滤“阅读原文”“关注公众号”“二维码”等常见尾注
- 图片 URL 规范化、跟踪参数清理、二维码图片过滤
- 单行失败不阻断整个批次
- 可选 JSON 检查点，支持分批处理

## 快速开始

```bash
python -m venv .venv
.venv\\Scripts\\activate
pip install -e .
travel-pgc-cleaner --input examples/sample_input.csv --output output/cleaned.csv
```

Excel 支持：

```bash
pip install -e .[xlsx]
```

需要抓取 URL 时显式开启：

```bash
travel-pgc-cleaner --input input.csv --output output.csv --fetch --state state.json
```

## 输入字段

| 字段 | 必需 | 说明 |
| --- | --- | --- |
| id | 否 | 断点记录标识；缺失时使用行号 |
| service_name | 否 | 元服务或目的地名称 |
| title | 否 | 内容标题 |
| url | 否 | 原文地址；配合 `--fetch` 使用 |
| raw_content | 否 | HTML 或纯文本正文 |
| image_urls | 否 | 逗号、分号、换行或竖线分隔的图片地址 |

输出会新增 `clean_content`、`clean_images`、`status` 和 `error`。

## 测试

```bash
set PYTHONPATH=src
python -m unittest discover -s tests -v
```

## 安全说明

- 不在代码中硬编码密钥；如后续接入模型，请从环境变量读取。
- 不要提交真实业务表格、浏览器用户目录、运行日志或缓存。
- 公开前应再次运行密钥扫描并检查示例数据。
