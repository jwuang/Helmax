# 验证与验收

当前正式官网发布产物为 `dist-pages/`。运行 `pnpm build:pages && pnpm test:pages`，检查三语各六种尺寸、语言切换、刷新与返回、无脚本浏览、加载、菜单及无障碍。指定其他浏览器可运行 `pnpm test:pages --browser=webkit` 或 `--browser=firefox`，先安装对应浏览器与系统依赖。以下 `pnpm verify` 与服务详情等测试覆盖仓库内独立的 Astro 样稿。

`pnpm verify` 执行类型检查、内容校验、lint、单元测试、预览构建和三种浏览器测试。CI 额外审计依赖并保留 7 天构建和测试产物，不部署生产。

浏览器覆盖三语首页、服务详情、译文切换、草稿栏目隐藏、真实 404、移动端菜单、键盘跳转、无 JavaScript 浏览、320/390/768/1024/1440px 视口以及自动 WCAG 2 A/AA、2.1 AA 检查。自动检查不能代替人工阅读、真实设备和完整无障碍评估。

性能验收：生产构建、移动端 Lighthouse 默认节流、固定 Chromium 版本；关键页面目标 Performance ≥90、首屏传输 ≤1MB。可启动 `pnpm preview` 后执行 `pnpm exec lighthouse http://localhost:4321/zh-cn/ --output=html --output-path=reports/lighthouse.html --chrome-flags='--headless --no-sandbox'`（先创建 reports）。另行验证大陆三网与海外实际访问。

生产上线检查：运行 `pnpm test:headers https://your-domain.com/`，打开浏览器检查 CSP 是否阻断资源、HTTPS 跳转、三语 404 状态码、sitemap、robots、canonical / hreflang。预览 robots 必须 Disallow，正式页面必须可索引；404、根入口和空栏目保持 noindex。

负载报告模板：时间、服务商与机型、带宽、线路、测试位置、URL、缓存命中状态、并发阶梯、请求数、P50/P95、错误率、流量与 CPU/内存。只对供应商允许的自有源站测试，不对共享 CDN 随意施压。该脚本请求单 URL，不模拟全页面资源或长期在线用户。

本次实际执行结果记录在 `docs/TEST-RESULTS.md`；未执行的检查不得作为已通过报告。

## WSL 中的 WebKit

Playwright 支持 WSL；Linux 系统依赖安装器面向 Ubuntu／Debian。Ubuntu 24.04 的 WSL 中，在项目目录运行：

```sh
pnpm exec playwright install --with-deps webkit
pnpm build:pages
pnpm test:pages --browser=webkit
```

2026-11-03 当前机器为 Arch Linux WSL2，安装器回退到 Ubuntu 24.04 后因没有 `apt-get` 失败；主机 ICU 为 78，下载的 WebKit 要求 ICU 74，另缺多个媒体和图形库。免密 `sudo` 不可用，需要操作者输入密码。

在该 Arch WSL 中可使用包含浏览器与系统依赖的官方 Ubuntu 容器。先手动安装并启动 Docker，再从仓库根目录运行已经准备好的检查脚本：

```sh
sudo pacman -S --needed docker
sudo systemctl start docker
sudo bash scripts/test-pages-webkit-container.sh
```

脚本使用与本项目 Playwright 1.64.1 一致的 `mcr.microsoft.com/playwright:v1.64.1-noble` 镜像，安装 pnpm 11.25.0 和锁定依赖后，构建并检查正式官网的三语 WebKit 页面。仓库只读挂载；构建在容器内的独立副本执行，不修改宿主文件。结果在终端输出，容器退出时清理临时副本。首次运行需要下载镜像与依赖。当前机器尚未执行该容器检查，不能算作 WebKit 已通过。

参考：[官方系统要求](https://playwright.dev/docs/intro#system-requirements)、[浏览器依赖安装](https://playwright.dev/docs/browsers#install-system-dependencies)、[官方容器与版本匹配](https://playwright.dev/docs/docker)。
