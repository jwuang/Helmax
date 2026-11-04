# 验证与验收

所有检查面向 `dist-pages/` 中的三语展览官网。使用 Node 26.13.0（26.x LTS）和 pnpm 12.16.1，安装锁定依赖与浏览器后运行：

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install --with-deps chromium firefox webkit
pnpm verify
pnpm test:pages --browser=firefox
pnpm test:pages --browser=webkit
```

`pnpm verify` 依次执行 TypeScript 检查（`tsc --noEmit`）、ESLint、页面构建单元测试、官网构建和默认 Chromium 浏览器检查。`pnpm test:e2e` 与 `pnpm test:pages` 是同一官网检查入口，都接受 `--browser=chromium`、`--browser=firefox` 或 `--browser=webkit`。单独运行浏览器检查前先执行 `pnpm build`；CI 安装并检查三种浏览器，额外审计依赖。

单元测试验证三语构建、译文完整性、资源、章节锚点、语言链接和发布文件范围，以及预览服务器的路由、路径限制和参数。浏览器检查通过临时 HTTP 服务访问 `/corporate-portal/` 下的产物，覆盖：

- 三语各 1440×900、1920×1080、1280×720、768×1024、390×844、320×740 六种视口，共 18 组；检查溢出、章节边界、导航、图片及脚本错误。
- 语言切换、章节锚点、刷新、返回、Escape、点击外部和手机菜单互斥。
- 加载完成、超时释放、Logo 错误、减少动态效果和无 JavaScript 浏览。
- 三语桌面、手机、菜单和加载页的 axe WCAG 2 A/AA、2.1 A/AA 检查。

结果和截图输出到已忽略的 `reports/design-prototype/`，不会自动覆盖归档截图。自动检查不能代替人工阅读、真实设备和完整无障碍评估。历史验证保留在 [TEST-RESULTS.md](TEST-RESULTS.md)，当前进度见 [PROJECT-STATUS.md](PROJECT-STATUS.md#实现与验证)；历史通过记录不能代替本次变更验证。

性能检查可在 `pnpm build && pnpm preview` 后运行 Lighthouse：

```sh
pnpm exec lighthouse http://localhost:4321/zh-cn/ --output=html --output-path=reports/lighthouse.html --chrome-flags='--headless --no-sandbox'
```

先创建 `reports/`。记录浏览器版本、设备节流和运行环境；Performance ≥90、首屏传输 ≤1MB 是待验收目标，不是已通过结论。发布后核对 HTTPS、三个语言页面、资源和语言链接；当前页面和 robots.txt 继续禁止搜索收录。

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

脚本使用与本项目 Playwright 1.64.1 一致的 `mcr.microsoft.com/playwright:v1.64.1-noble` 镜像，按 `.node-version` 和 `package.json` 安装 Node 26.13.0、pnpm 12.16.1 及锁定依赖后，构建并检查正式官网的三语 WebKit 页面。仓库只读挂载；构建在容器内的独立副本执行，不修改宿主文件。结果在终端输出，容器退出时清理临时副本。首次运行需要下载镜像与依赖。2026-11-03 用户已手动执行当时的脚本、核对最终 JSON，并确认 WebKit 的 18 组视口、交互、加载及无障碍检查通过；原始 WebKit JSON 未归档到仓库。

检查脚本在 JSON 后会打印 `PASS: webkit` 或 `FAIL: webkit`。JSON 中 `viewportChecks` 应为 18，`failures`、`errors` 及每项无障碍 `violations` 均应为空数组。命令完成后立即运行 `echo $?` 也可查看退出码：`0` 为通过，非 `0` 为失败；该退出码会被下一条终端命令覆盖。

参考：[官方系统要求](https://playwright.dev/docs/intro#system-requirements)、[浏览器依赖安装](https://playwright.dev/docs/browsers#install-system-dependencies)、[官方容器与版本匹配](https://playwright.dev/docs/docker)。
