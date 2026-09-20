# initeasylife · 知识花园

一个基于 Jekyll 的个人知识库，提供专题导航、即时搜索、时间归档和文章目录。页面使用本地 CSS、原生 JavaScript 和 SVG 图标，不需要 Node.js 构建。

## 本地运行

使用 Ruby 3.1 或更新版本，避免 macOS 系统自带 Ruby 的开发头文件问题。

```sh
bundle install
bundle exec jekyll serve
```

打开 `http://127.0.0.1:4000`。生成文件写入 `.build/`，不要提交。修改 `_config.yml` 后需要重启服务。

```sh
bundle exec jekyll build --strict_front_matter
python3 scripts/check_site.py .build
```

## 文档组织

| 专题 | topic 值 | 目录 |
| --- | --- | --- |
| 推荐系统 | `recommendation` | `_posts/recommendation/`、`_notes/recommendation/` |
| 机器学习 | `machine-learning` | `_posts/machine-learning/` |
| 数学基础 | `mathematics` | `_posts/mathematics/` |
| 概率统计 | `statistics` | `_posts/statistics/` |
| 论文阅读 | `papers` | `_notes/papers/` |
| 生物信息 | `bioinformatics` | `_posts/bioinformatics/` |

分类名称、说明、图标和颜色统一维护在 `_data/topics.yml`。`topic` 是页面筛选和统计的唯一分类字段；文章的 `categories` 与其保持一致。

- 有日期的笔记放入 `_posts/<topic>/YYYY-MM-DD-title.md`。
- 没有原始日期的摘录放入 `_notes/<topic>/title.md`。使用 [Jekyll collections](https://jekyllrb.com/docs/collections/) 输出，不补写日期。
- R Markdown 原文件存放在 `assets/downloads/bioinformatics/`，对应文章提供下载和静态代码阅读；网站不执行 R 代码。
- 未完成的提纲使用 `status: seed`，在列表和正文中显示「待完善」。

新增文章示例：

```yaml
---
title: 一篇新的学习笔记
date: 2026-09-20 12:00:00 +0800
topic: recommendation
categories: [recommendation]
tags: [召回, 双塔模型]
description: 一句话概括本文实际包含的内容。
permalink: /recommendation/example/
---
```

正文用 Markdown 编写；`layout: post` 和 `math: true` 由配置默认提供。纯代码文章可以设 `math: false`。`description` 是列表摘要，也参与搜索；搜索范围为标题、摘要、专题名称与标签。

既有文章通过显式 `permalink` 保留旧地址，原 front matter 的日期优先于文件名中的日期。移动目录时保持 `permalink` 不变。不要在正文内重复加载 MathJax，文章布局统一加载固定版本；公式渲染需要访问 jsDelivr CDN。

## 页面与维护

- `_layouts/`：全站、文章、普通内容页布局。
- `_includes/`：侧栏、图标、文档列表组件。
- `assets/css/style.css`：共享颜色、桌面与手机布局、正文排版。
- `assets/js/site.js`：搜索、分类筛选、移动导航、自动文章目录。
- `library.html`：全部文档；支持 `?topic=mathematics&q=正则化` 的可分享筛选链接。
- `archive.html`：按原始日期归档，无日期札记单列。
- `scripts/check_site.py`：检查构建后的内部链接、文档索引与分类一致性。

部署仍使用 GitHub Pages / Jekyll，无需自定义插件。保留仓库当前的 Pages 发布方式，提交源文件后由 Pages 构建即可。本地使用 `bundle exec jekyll build --baseurl /preview --destination /tmp/garden-preview` 可检查子路径部署。
