# 内容维护

1. 从 `src/content/services/discovery.zh-cn.md` 复制对应集合内的样例，或从案例、新闻草稿模板开始。
2. 首先设置 `draft: true`，填写真实信息并审核；发布时改成 `draft: false`。`previewOnly: true` 只进入预览；生产会剔除。
3. 同一集合、同一主题的三语稿共享 `translationKey`，`locale` 为 `zh-cn`、`zh-hk` 或 `en`。外语必须有同 key 简体源稿；允许暂缺译文，不自动机器翻译。草稿译文不计入 hreflang。
4. `routeSlug` 使用小写英文字母、数字和单连字符，确定后保持稳定。文件名不决定 URL；路径为 `/{locale}/{collection}/{routeSlug}/`。
5. title、summary、category、publishedAt 必填；order 控制顺序。可选 updatedAt、seoTitle、seoDescription。
6. 封面放 `public/images/`，cover 写 `/images/name.webp`，必须有 coverAlt。建议预先输出 1200×675 WebP。首页大图使用 `src/assets/` 和 Astro Picture 自动生成 AVIF / WebP。
7. 正文仅使用 Markdown，不允许原始 HTML。使用绝对站内路径链接；站外仅使用 HTTP(S)，联系链接仅使用 mailto / tel。禁止脚本、data 协议及 URL 内嵌凭据。
8. 运行 `pnpm check`、`pnpm build:preview` 并预览全部语言。翻译缺失时切换到相应语言栏目页并显示提示；不静默展示其他语言正文。

案例与新闻没有已核实正文时不发布。企业介绍、服务承诺、资质、客户标识与隐私说明需要人工审校。`publicationReviewed` 是人工完成审核的记录，不是自动真实性证明。

更换品牌时同时检查导航、分享图片、favicon、页脚、企业全称及全部语言的内容。隐私文案应与实际 CDN/服务器日志、联系信息处理、地区和保存期限一致。
