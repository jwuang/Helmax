# 验证与验收

`pnpm verify` 执行类型检查、内容校验、lint、单元测试、预览构建和三种浏览器测试。CI 额外审计依赖并保留 7 天构建和测试产物，不部署生产。

浏览器覆盖三语首页、服务详情、译文切换、草稿栏目隐藏、真实 404、移动端菜单、键盘跳转、无 JavaScript 浏览、320/390/768/1024/1440px 视口以及自动 WCAG 2 A/AA、2.1 AA 检查。自动检查不能代替人工阅读、真实设备和完整无障碍评估。

性能验收：生产构建、移动端 Lighthouse 默认节流、固定 Chromium 版本；关键页面目标 Performance ≥90、首屏传输 ≤1MB。可启动 `pnpm preview` 后执行 `pnpm exec lighthouse http://localhost:4321/zh-cn/ --output=html --output-path=reports/lighthouse.html --chrome-flags='--headless --no-sandbox'`（先创建 reports）。另行验证大陆三网与海外实际访问。

生产上线检查：运行 `pnpm test:headers https://your-domain.com/`，打开浏览器检查 CSP 是否阻断资源、HTTPS 跳转、三语 404 状态码、sitemap、robots、canonical / hreflang。预览 robots 必须 Disallow，正式页面必须可索引；404、根入口和空栏目保持 noindex。

负载报告模板：时间、服务商与机型、带宽、线路、测试位置、URL、缓存命中状态、并发阶梯、请求数、P50/P95、错误率、流量与 CPU/内存。只对供应商允许的自有源站测试，不对共享 CDN 随意施压。该脚本请求单 URL，不模拟全页面资源或长期在线用户。

本次实际执行结果记录在 `docs/TEST-RESULTS.md`；未执行的检查不得作为已通过报告。
