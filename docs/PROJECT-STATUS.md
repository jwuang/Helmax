# Helmax 官网：项目进度与接续说明

更新日期：2026-11-03。用户已明确确认：**现在这版就是正式网站**。原概念稿已作为官网首页维护，并补齐简体中文、香港繁体中文和英文。

## 当前正式网站

默认地址：<https://jwuang.github.io/corporate-portal/>，根路径展示简体。独立语言地址：

- [简体中文](https://jwuang.github.io/corporate-portal/zh-cn/)
- [繁體中文](https://jwuang.github.io/corporate-portal/zh-hk/)
- [English](https://jwuang.github.io/corporate-portal/en/)

首页源文件沿用历史路径 [helmax-exhibition-prototype.html](design/helmax-exhibition-prototype.html)。`scripts/build-pages.ts` 从同一 HTML 模板与内嵌 `home-translations` 字典生成完整三语静态页面，`.github/workflows/pages.yml` 验证并发布到 GitHub Pages。页面标题与页脚已改为正式官网表述。不要再把该版本当作等待迁移才能使用的概念稿。

仓库 `src/` 仍是之前的 Astro 样稿，尚未套用当前 Helmax 官网设计。当前线上官网以 Pages 发布内容为准。网站继续沿用既有的 `noindex, nofollow` 与禁止抓取设置；后续收录策略可单独调整。

## 从这里继续

1. 阅读本文件，保留已经确定的要求。
2. 查看线上三语官网，或直接用浏览器打开首页源文件；保留同目录的 `assets/`。本地语言预览通过 `?lang=zh-cn`、`?lang=zh-hk`、`?lang=en` 切换，需要 JavaScript。
3. 查阅 [项目聊天记录](CHAT-LOG.md)、[首页设计说明](HOMEPAGE-WIREFRAME.md) 和 [Pages 部署指南](GITHUB-PAGES.md)。
4. 在当前官网上继续完善内容和交互，不重新开始需求访谈。

## 已确认的要求

| 项目 | 用户明确的要求 |
| --- | --- |
| 网站用途 | 企业介绍／展示网站；用户已确认当前版本为正式网站 |
| 服务对象 | 制造类企业 |
| 品牌 | 统一使用 **Helmax** 名称和企业 PPT 中的 Logo |
| 展示范围 | 完整覆盖电子元器件，以及设备与工具 |
| 产品组织 | 导航统一为“产品”；所有产品一起展示，最多用小标题或副标题分类；共用卡片与视觉规则 |
| 导航 | **首页／关于企业／产品／联系我们**，提供简体／繁体／英文切换 |
| 首页体验 | 每个板块以整屏呈现，形成一段一段的展览体验 |
| 文化位置 | 文化／理念靠前；首屏具有设计感，并与理念结合 |
| 文化关键词 | **利他、专业、效率、创新** |
| 整体气质 | **科技感** |
| 加载体验 | 简洁的等待页面 |

资料来自 [Helmax Company Profile v2](HelmaxCompanyProfile+v2.pptx)，共 14 页。PPT 已读取全部文字与内嵌图片，未用 PowerPoint 完整渲染原始排版。Helmax、Zeension、Wayland 的法律或股权关系仍应按实际资料说明。

## 当前首页

首页保持六章：

1. **品牌与理念**：深蓝背景、冰蓝／青色点缀、网格与连接节点，结合主营说明和四项文化关键词。简体标题为“以专业，成就彼此。”。
2. **企业文化**：利他、专业、效率、创新，辅以使命和愿景。
3. **关于 Helmax**：企业简介、产品范围与合作支持。
4. **产品**：元器件与设备工具统一陈列，用小标题分类。
5. **服务与能力**：采购优化、现货与库存支持、元器件质量与交付流程。
6. **联系与合作**：简短引导、联系资料状态与正式版权页脚。

大屏以 `min-height: 100svh` 控制一章一屏；手机和平板内容较多时自然延展。英文标题、文化卡片、使命愿景及较矮桌面下的产品图片比例已做适配。减少动态效果时关闭动效、平滑滚动与停靠。

加载页仅有 **Helmax Logo、细进度线、对应语言的“正在准备”**，按真实 Logo／字体准备状态显示；快速准备直接进入，4.5 秒超时后释放正文。Logo 出错或关闭 JavaScript 时也可阅读内容。

三语覆盖全部六章、导航、菜单、加载状态、图片替代文字、章节提示和元数据。语言菜单标明当前语言，支持键盘、Escape 与点击外部关闭；与手机菜单互斥。发布版本可无脚本切换三语；启用脚本时保留 URL 中的章节锚点，刷新与返回均保留语言。

## 文件导航

| 文件／目录 | 用途 |
| --- | --- |
| [CHAT-LOG.md](CHAT-LOG.md) | 用户需求原文与阶段答复，保留讨论顺序 |
| [GITHUB-PAGES.md](GITHUB-PAGES.md) | 正式官网的三语地址、构建、发布及回退 |
| [HOMEPAGE-REVIEW.md](HOMEPAGE-REVIEW.md) | 原官网评估、PPT 资料梳理与历史设计约束 |
| [HOMEPAGE-WIREFRAME.md](HOMEPAGE-WIREFRAME.md) | 章节构图、文化文案、滚动与加载设计依据 |
| [首页源文件](design/helmax-exhibition-prototype.html) | 正式官网模板、三语字典与本地可交互预览 |
| [素材目录](design/assets/) | PPT 提取的 Logo、焊接设备和水泵示例图片 |
| [预览截图](design/previews/) | 三语桌面与手机首屏等截图 |
| [官网检查脚本](../scripts/check-design-prototype.mjs) | 三语各六种尺寸、交互、加载与无障碍验证 |
| [检查结果](design/validation-results.json) | 本次 Pages 官网浏览器检查记录 |
| [本地 UI/UX 技能](../.agents/skills/ui-ux-pro-max/SKILL.md) | 后续设计继续使用的技能及上游许可证 |

三语首屏截图：

| 语言 | 桌面 | 手机 |
| --- | --- | --- |
| 简体 | [1440×900](design/previews/helmax-hero-desktop.png) | [390×844](design/previews/helmax-hero-mobile.png) |
| 繁體 | [1440×900](design/previews/helmax-zh-hk-hero-desktop.png) | [390×844](design/previews/helmax-zh-hk-hero-mobile.png) |
| English | [1440×900](design/previews/helmax-en-hero-desktop.png) | [390×844](design/previews/helmax-en-hero-mobile.png) |

## 实现与验证

当前官网是三语静态网站，没有数据库、后台或登录。Pages 输出仅含默认首页、三个语言目录、三张展示图片和 `robots.txt`。

本次官网浏览器检查覆盖：

- 三语各 1440×900、1920×1080、1280×720、768×1024、390×844、320×740 六种尺寸，共 18 组；检查横向溢出、章节高度、内容边界、导航重叠、图片及脚本错误。
- 三语菜单、当前语言、章节锚点、刷新、返回、Escape、点击外部、手机菜单互斥。
- 各语言的加载等待与完成、减少动态效果，以及超时释放、Logo 错误、无 JavaScript 阅读和语言切换。
- 三语桌面、手机、展开的语言菜单和加载页的 axe 检查，规则为 WCAG 2 A/AA 与 2.1 A/AA。

官网上述 18 组视口、全部交互与加载检查通过，未记录脚本错误、缺失图片、横向溢出或所选 axe 规则违规；本地 HTML 的三语预览也已完成同范围检查。

`pnpm check`、`pnpm lint`、7 项单元测试和 Astro 预览构建通过。已运行完整 `pnpm verify`，其中旧 Astro 样稿的浏览器测试未全通过：Chromium 检出原有英文页 320px 溢出，Firefox 部分交互超时，WebKit 缺少系统动态库。上述测试对象是 `dist/` 中的旧样稿；当前官网在 `dist-pages/`，由 `pnpm test:pages` 单独验证。当前官网浏览器检查范围为 Chromium。

使用 Node 24.19.0（24.x）、pnpm 11.25.0：

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm lint
pnpm test
pnpm build:pages
pnpm exec playwright install chromium
pnpm test:pages
```

`pnpm test:pages` 通过临时本地 HTTP 服务检查 `/corporate-portal/` 下的发布产物。直接验证本地源文件可运行 `node scripts/check-design-prototype.mjs`。结果及截图写入已忽略的 `reports/design-prototype/`，不会自动覆盖仓库中的截图。

用户询问 WSL 安装 WebKit 依赖后，已确认当前 Arch WSL2 无 `apt-get`，且 `sudo` 需要密码。用户已手动安装并启动 Docker；当前会话无 Docker 套接字权限，已请用户手动运行 `sudo bash scripts/test-pages-webkit-container.sh`，在官方 Ubuntu 容器中检查当前官网，结果待反馈。可通过 `pnpm test:pages --browser=webkit` 指定浏览器；操作见 [验证与验收](VALIDATION.md#wsl-中的-webkit)。

## 仍需补充的资料

- 元器件正式分类、代表产品和图片；目前两个元器件卡片保留待补资料提示。
- 设备工具的正式产品清单、名称、型号、规格、用途与较清晰图片。
- 企业关系及可公开的合作／品牌关系，真实电话、邮箱和地址。
- PPT 第 9 页供应商等级口径、第 10 页“6,00+ vendors”、第 12 页 Flexcon RMA Team、经验年限与服务承诺的适用范围。

不虚构产品参数、联系方式、客户、资质、库存或业绩；不把品牌 Logo 解释为已获授权代理资格。元器件流程的适用范围不能直接扩大为所有设备的服务承诺。
