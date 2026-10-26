# 验证记录

执行日期：2026-10-26。环境：Node 24.19.0、pnpm 11.25.0，当前云端 Linux 工作区。

- Astro / TypeScript：0 errors、0 warnings、0 hints。
- 内容：11 篇文档校验通过；9 篇明确标注的预览服务，2 篇未发布栏目模板。
- ESLint：通过。
- 单元测试：5 项通过，覆盖草稿与生产样例隔离、重复 URL/译文、缺少源稿、缺失图片、HTML 注入和不安全链接。
- 预览构建：35 个 HTML 页面；内部链接、资源与必需元信息检查通过。robots 禁止索引，页面含 noindex。
- 正式构建保护：缺少真实域名、企业资料和人工审核时按预期拒绝构建。
- Playwright Chromium：9 项通过，包括三语流程、多端尺寸、菜单、无 JavaScript、自动无障碍及 404。
- Playwright Firefox：9 项通过。当前容器默认浏览器内容沙箱导致启动崩溃，仅在本地测试命令中设置 MOZ_DISABLE_CONTENT_SANDBOX=1 后通过；未修改生产配置或 CI 浏览器安全设置。
- WebKit：当前容器缺少 libgtk-4 / libgraphene 等系统库，本地未执行。安装系统依赖后的 GitHub 网站工作流已通过，见文末链接。
- 依赖审计：未发现已知漏洞。
- Caddy 2.10.2：参考配置验证通过；本地 HTTP 上三语首页与对应语言 404（状态码 404）检查通过。
- 严格 CSP：真实浏览器无 CSP 违规及页面运行错误，语言切换正常；响应头检查通过。预期访问不存在页面会有 404 控制台记录。
- 人工目视：桌面与手机首页截图已检查。

生产 HTTPS、域名解析、CDN / WAF、真实线路、备份恢复与源站负载测试未执行，见 OPS-TODO.md。本地 HTTP 验证不能替代生产 HTTPS 验收。

补充验证：

- 本地 Lighthouse 移动端首页初测：Performance 100、Accessibility 100、Best Practices 100，LCP 约 1.0 秒，总传输 18,015 字节。仅代表本地参考配置，不能替代跨境真实访问测试。
- SEO 初测 69，预览站禁止索引是预期行为，不作为正式发布 SEO 验收结果。
- 初测发现语言按钮可访问名称未包含可见简写，已修复；无障碍测试增加 WCAG 2.1 A 标签，修复后 Chromium / Firefox 测试均通过。
- 网站工作流对应源码提交 18e86ea：https://github.com/jwuang/corporate-portal/actions/runs/40259089146 。状态已核对为 success；该工作流包含依赖审计、类型/内容/lint/单元检查、静态构建和 Chromium / Firefox / WebKit 测试。Dependabot 成功记录不作为网站 CI 结果。
