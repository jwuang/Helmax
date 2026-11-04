# Helmax 官网：项目进度与接续说明

更新日期：2026-11-04。用户已明确确认：**现在这版就是正式网站**。原概念稿已作为官网首页维护，并补齐简体中文、香港繁体中文和英文。

## 当前正式网站

默认地址：<https://helmax.1143402012.workers.dev/>，根路径展示简体。独立语言地址：

- [简体中文](https://helmax.1143402012.workers.dev/zh-cn/)
- [繁體中文](https://helmax.1143402012.workers.dev/zh-hk/)
- [English](https://helmax.1143402012.workers.dev/en/)

首页源文件沿用历史路径 [helmax-exhibition-prototype.html](design/helmax-exhibition-prototype.html)。`scripts/build-pages.ts` 从同一 HTML 模板与内嵌 `home-translations` 字典生成完整三语静态页面，Cloudflare Workers Builds 验证并发布到 Workers Static Assets。页面标题与页脚已改为正式官网表述。不要再把该版本当作等待迁移才能使用的概念稿。

2026-11-04 官网清理和工具链升级提交 [`47d38a6`](https://github.com/jwuang/corporate-portal/commit/47d38a61dcdd4a805310ad35cd2f7af920f15a96) 已推送 `origin/main`，[Pages 工作流](https://github.com/jwuang/corporate-portal/actions/runs/41801095093) 构建与部署成功，[官网 CI](https://github.com/jwuang/corporate-portal/actions/runs/41801095101) 也已通过 Chromium、Firefox 和 WebKit 检查。发布后读取默认首页、三个语言页面、三张图片和 `robots.txt`，8 个文件均返回 HTTP 200，SHA-256 与本地构建一致；三语文档语言、Helmax 标题和六章结构正确。

2026-11-04 用户明确要求移除早期样稿，只保留当前段落式展览官网。开发、构建、预览、单元测试和浏览器检查统一围绕这版官网；`pnpm build` 与 `pnpm build:pages` 均生成 `dist-pages/`。网站继续沿用既有的 `noindex, nofollow` 与禁止抓取设置；后续收录策略可单独调整。

## 从这里继续

1. 阅读本文件，保留已经确定的要求。
2. 查看线上三语官网，或直接用浏览器打开首页源文件；保留同目录的 `assets/`。本地语言预览通过 `?lang=zh-cn`、`?lang=zh-hk`、`?lang=en` 切换，需要 JavaScript。
3. 查阅 [项目聊天记录](CHAT-LOG.md)、[首页设计说明](HOMEPAGE-WIREFRAME.md) 和 [Cloudflare 部署指南](CLOUDFLARE.md)。
4. 在当前官网上继续完善内容和交互，不重新开始需求访谈。

## 已确认的要求

| 项目 | 用户明确的要求 |
| --- | --- |
| 网站用途 | 企业介绍／展示网站；仅保留当前段落式展览官网，移除早期样稿 |
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

三语覆盖全部六章、导航、菜单、加载状态、图片替代文字、章节提示和元数据。浏览器标签页标题统一为 **Helmax**。语言切换入口统一为地球图标与小下拉箭头，与下拉菜单等宽，点击区域占满页头高度；下拉菜单从页头下边缘展开，采用紧凑宽度、居中文字及较小内边距，触屏保留便于点击的选项高度。当前语言通过加粗和下划线标明，不显示右侧勾选标记。入口保留对应语言的无障碍名称，支持键盘、Escape 与点击外部关闭；与手机菜单互斥。发布版本可无脚本切换三语；启用脚本时保留 URL 中的章节锚点，刷新与返回均保留语言。

## 文件导航

| 文件／目录 | 用途 |
| --- | --- |
| [CHAT-LOG.md](CHAT-LOG.md) | 用户需求原文与阶段答复，保留讨论顺序 |
| [CLOUDFLARE.md](CLOUDFLARE.md) | 正式官网的三语地址、构建、发布及回退 |
| [GITHUB-PAGES.md](GITHUB-PAGES.md) | 旧地址跳转说明 |
| [HOMEPAGE-REVIEW.md](HOMEPAGE-REVIEW.md) | 原官网评估、PPT 资料梳理与历史设计约束 |
| [HOMEPAGE-WIREFRAME.md](HOMEPAGE-WIREFRAME.md) | 章节构图、文化文案、滚动与加载设计依据 |
| [首页源文件](design/helmax-exhibition-prototype.html) | 正式官网模板、三语字典与本地可交互预览 |
| [素材目录](design/assets/) | PPT 提取的 Logo、焊接设备和水泵示例图片 |
| [预览截图](design/previews/) | 三语桌面与手机首屏等截图 |
| [语言定义](../scripts/lib/locales.ts) | 语言列表、类型和 HTML 语言码 |
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

官网是三语静态网站，没有数据库、后台或登录。唯一发布目录为 `dist-pages/`，仅含默认首页、三个语言目录、三张展示图片和 `robots.txt`。`pnpm dev` 构建并监听 HTML／素材变更，在 4321 端口提供页面，修改后刷新；`pnpm preview` 服务已有产物。

当前工具链为 Node 26.13.0（26.x LTS）和 pnpm 12.16.1，Node 类型声明同步至 26.x。TypeScript 保留 6.0.3：最新稳定版 7.0.2 不在 `typescript-eslint` 8.72.1 的支持范围（`<6.1.0`）内。

本次检查了 [Node 类型升级 PR #6](https://github.com/jwuang/corporate-portal/pull/6) 和 [Lighthouse 升级 PR #9](https://github.com/jwuang/corporate-portal/pull/9)。对应升级已纳入本次改动：`@types/node` 26.6.6、Lighthouse 13.6.0，另将 ESLint 升至 10.14.0、Pages Actions 升至最新稳定主版本。移除 Astro、Tailwind 及样稿专用工具后保留 10 个直接开发依赖。用户已确认本地预览正常，并授权推送及部署。

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install --with-deps chromium firefox webkit
pnpm verify
pnpm test:pages --browser=firefox
pnpm test:pages --browser=webkit
```

`pnpm verify` 执行类型检查、lint、页面构建单元测试、官网构建和 Chromium 检查。`pnpm test:e2e` 与 `pnpm test:pages` 为同一官网检查入口；CI 对官网执行 Chromium、Firefox 和 WebKit 检查。浏览器覆盖三语各六种视口（共 18 组）、布局边界、语言切换、锚点、刷新和返回、菜单、加载完成及异常、减少动态效果、无 JavaScript 浏览与 axe 无障碍检查，细节见 [验证指南](VALIDATION.md)。

2026-11-04 移除早期样稿并升级工具链后，`pnpm verify` 全部通过：类型检查、lint、5 项单元测试、官网构建，以及 Chromium 的 18 组视口、交互、加载和无障碍检查。Firefox 的相同 18 组检查也全部通过，两个浏览器的错误、失败和所选 axe 违规均为空。新预览服务器的实际 HTTP 200／301／404 响应已验证；开发模式已在 Node 26.13.0 下验证首次构建、模板变更自动重建、页面响应和正常退出，模板内容保持不变。本地 WebKit 因系统库缺失且 Docker 服务不可用而未运行；推送后由上述 GitHub Actions 官网 CI 补齐验证，三个浏览器步骤均成功，整个检查工作流通过。

`pnpm install --frozen-lockfile` 已通过；最初使用临时工具链验证，随后用户已将当前目录切换到 Node 26.13.0，pnpm 为 12.16.1。Lighthouse 13.6.0 对本地简体官网完成实际检查，无运行错误，报告位于已忽略的 `reports/lighthouse-upgrade.json`；单次本地分数不作为线上性能验收。最终依赖审计为 0 高危、0 严重、2 项中等风险，均在开发工具的间接依赖：`minimatch`（[公告](https://github.com/advisories/GHSA-g3hv-75wg-m249)）与 `glob`（[公告](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4)）。公告修复版本跨越上游依赖的主版本范围，当前未强制覆盖，后续跟进上游兼容升级。

历史记录：2026-11-03 官网 Chromium 的 18 组视口、交互、加载和所选 axe 规则检查通过；用户另在官方 Playwright Docker 容器中手动执行 WebKit 检查，核对 `browser: webkit`、`viewportChecks: 18` 及空的 `failures`、`errors`、`violations` 后明确确认通过，原始 WebKit JSON 未归档。该历史记录依据用户终端反馈；本次升级的 WebKit 结论以上述 2026-11-04 CI 为依据。操作见 [WSL 中的 WebKit](VALIDATION.md#wsl-中的-webkit)。

`pnpm test:pages` 通过临时本地 HTTP 服务检查 `/corporate-portal/` 下的发布产物；直接验证本地 HTML 源文件可运行 `node scripts/check-design-prototype.mjs`。结果及截图写入已忽略的 `reports/design-prototype/`，不会自动覆盖归档截图。[CHAT-LOG.md](CHAT-LOG.md) 与 [TEST-RESULTS.md](TEST-RESULTS.md) 保留历史原文，其中早期样稿、命令和测试结论仅供追溯，不作为当前操作指南。

## 仍需补充的资料

- 元器件正式分类、代表产品和图片；目前两个元器件卡片保留待补资料提示。
- 设备工具的正式产品清单、名称、型号、规格、用途与较清晰图片。
- 企业关系及可公开的合作／品牌关系，真实电话、邮箱和地址。
- PPT 第 9 页供应商等级口径、第 10 页“6,00+ vendors”、第 12 页 Flexcon RMA Team、经验年限与服务承诺的适用范围。

不虚构产品参数、联系方式、客户、资质、库存或业绩；不把品牌 Logo 解释为已获授权代理资格。元器件流程的适用范围不能直接扩大为所有设备的服务承诺。
