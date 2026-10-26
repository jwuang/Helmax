export const locales = ['zh-cn', 'zh-hk', 'en'] as const;
export type Locale = (typeof locales)[number];
export const languageNames: Record<Locale, string> = { 'zh-cn': '简体中文', 'zh-hk': '繁體中文', en: 'English' };
export const htmlLanguages: Record<Locale, string> = { 'zh-cn': 'zh-CN', 'zh-hk': 'zh-HK', en: 'en' };
export function isLocale(value: string): value is Locale { return locales.some((locale) => locale === value); }
export function pathFor(locale: Locale, section = '', slug = '') {
  return `/${[locale, section, slug].filter(Boolean).join('/')}/`;
}

const cn = {
  home: '首页', about: '关于我们', services: '产品与服务', cases: '案例', news: '新闻资讯', contact: '联系我们', privacy: '隐私说明',
  skip: '跳至主要内容', menu: '导航菜单', language: '选择语言', close: '关闭菜单',
  preview: '网站样稿 · 品牌与业务内容待确认', previewDetail: '当前为演示内容，不代表真实企业信息或业务承诺。',
  eyebrow: '连接 · 协作 · 向前', heroLine1: '以专业连接价值，', heroLine2: '让合作走得更远。',
  heroDescription: '从一次深入交流，到一个清晰方案。让每个需求被认真理解，让每一步合作都有方向。',
  explore: '了解我们的服务', talk: '开启对话', scroll: '向下探索',
  introLabel: '我们的理念', introTitle: '看见需求，\n也看见更远的可能。',
  introDescription: '好的合作，始于理解。我们重视清晰的沟通、务实的行动，以及持续的交流，让想法逐步成为可以落地的计划。',
  aboutLink: '进一步了解我们', servicesLabel: '业务方向', servicesTitle: '从想法，到行动。', servicesDescription: '围绕需求组织服务，让每个阶段都有明确的重点。',
  allServices: '探索全部服务', detail: '了解详情', sample: '服务样例',
  approachLabel: '合作方式', approachTitle: '把复杂留给思考，\n把清晰带给合作。',
  steps: [
    { title: '倾听与理解', description: '从目标和现状出发，共同明确真正需要解决的问题。' },
    { title: '梳理与共创', description: '将需求转化为清晰的范围、优先级和行动路径。' },
    { title: '推进与沟通', description: '在约定的节点交流进展，让每一次反馈推动工作向前。' },
  ],
  ctaLabel: '下一步，从交流开始', ctaTitle: '让我们一起，\n打开新的可能。', ctaDescription: '欢迎与我们分享你的需求与想法。',
  footerNote: '以清晰沟通，建立长期连接。', navigation: '探索', connect: '保持联系', copyright: '保留所有权利。',
  aboutTitle: '理解，是合作的起点。', aboutDescription: '我们希望每一次合作，都建立在充分理解、坦诚交流和明确目标之上。',
  aboutBody: '这里将介绍企业的真实背景、业务方向与团队。正式发布前，请以经过审核的公司资料替换样稿；资质、发展历程与客户信息仅在获得确认后展示。',
  valuesTitle: '让共同的目标，成为行动的方向。', values: [
    { title: '理解需求', description: '先了解背景，再讨论方案。' }, { title: '清晰协作', description: '明确范围、节奏与双方的期待。' }, { title: '持续交流', description: '重视反馈，让合作不断完善。' },
  ],
  contactTitle: '一次交流，\n一个新的开始。', contactDescription: '选择适合你的方式，与我们建立联系。',
  email: '电子邮箱', phone: '联系电话', address: '办公地址', wechat: '微信联系', contactPending: '联系方式将在企业信息确认后公布。', qrAlt: '企业微信联系二维码',
  breadcrumb: '当前位置', back: '返回列表', updated: '更新于', fallback: '此内容暂无当前语言版本，以下是该语言的栏目内容。', empty: '内容正在准备中。',
  caseDescription: '了解真实项目中的思考与实践。', newsDescription: '关注企业动态与最新分享。',
  privacyTitle: '隐私说明', privacyLead: '我们尊重你的隐私，并尽量减少网站对个人信息的处理。',
  privacySections: [
    { title: '网站收集什么', body: '本网站不提供注册或在线表单，不设置分析或广告 Cookie。点击邮箱或电话链接，会由你的设备打开相应应用。' },
    { title: '访问日志', body: '服务器或 CDN 可能记录 IP 地址、访问时间、请求路径与浏览器信息，用于运行维护和安全防护。正式上线前，网站运营者须在此明确实际服务商、保存期限及处理依据。' },
    { title: '主动联系', body: '你通过邮箱、电话或微信主动提供的信息，将由企业通过相应渠道处理。正式上线前，须补充处理目的、保存期限及个人信息权利的联系渠道。' },
  ],
  privacyPending: '此说明尚待运营者确认，不能作为正式发布版本。',
  notFound: '这一页，暂时没有找到。', notFoundDescription: '链接可能已更新，或页面尚未发布。你可以返回首页继续探索。', backHome: '返回首页',
  artAlt: '由几何建筑与连接线组成的抽象插画', related: '继续探索',
};
export type Copy = typeof cn;
const hk: Copy = {
  home: '首頁', about: '關於我們', services: '產品與服務', cases: '案例', news: '最新消息', contact: '聯絡我們', privacy: '私隱聲明',
  skip: '跳至主要內容', menu: '導覽選單', language: '選擇語言', close: '關閉選單',
  preview: '網站樣稿 · 品牌與業務內容有待確認', previewDetail: '目前為示範內容，不代表真實企業資料或業務承諾。',
  eyebrow: '連繫 · 協作 · 向前', heroLine1: '以專業連繫價值，', heroLine2: '讓合作走得更遠。',
  heroDescription: '從一次深入交流，到一個清晰方案。讓每個需求被認真理解，讓每一步合作都有方向。',
  explore: '了解我們的服務', talk: '展開對話', scroll: '向下探索',
  introLabel: '我們的理念', introTitle: '看見需求，\n也看見更遠的可能。',
  introDescription: '好的合作，始於理解。我們重視清晰的溝通、務實的行動，以及持續的交流，讓想法逐步成為可以落實的計劃。',
  aboutLink: '進一步了解我們', servicesLabel: '業務方向', servicesTitle: '從想法，到行動。', servicesDescription: '圍繞需求組織服務，讓每個階段都有明確的重點。',
  allServices: '探索全部服務', detail: '了解詳情', sample: '服務示例',
  approachLabel: '合作方式', approachTitle: '把複雜留給思考，\n把清晰帶給合作。',
  steps: [
    { title: '聆聽與理解', description: '從目標和現況出發，共同釐清真正需要解決的問題。' },
    { title: '梳理與共創', description: '將需求轉化為清晰的範圍、優先次序和行動路徑。' },
    { title: '推進與溝通', description: '在約定的節點交流進展，讓每一次回饋推動工作向前。' },
  ],
  ctaLabel: '下一步，從交流開始', ctaTitle: '讓我們一起，\n打開新的可能。', ctaDescription: '歡迎與我們分享你的需求與想法。',
  footerNote: '以清晰溝通，建立長期連繫。', navigation: '探索', connect: '保持聯絡', copyright: '版權所有。',
  aboutTitle: '理解，是合作的起點。', aboutDescription: '我們希望每一次合作，都建基於充分理解、坦誠交流和明確目標。',
  aboutBody: '這裏將介紹企業的真實背景、業務方向與團隊。正式發佈前，請以經審核的公司資料替換樣稿；資質、發展歷程與客戶資料僅在獲得確認後展示。',
  valuesTitle: '讓共同的目標，成為行動的方向。', values: [
    { title: '理解需求', description: '先了解背景，再討論方案。' }, { title: '清晰協作', description: '釐清範圍、節奏與雙方的期望。' }, { title: '持續交流', description: '重視回饋，讓合作不斷完善。' },
  ],
  contactTitle: '一次交流，\n一個新的開始。', contactDescription: '選擇適合你的方式，與我們建立聯繫。',
  email: '電郵', phone: '聯絡電話', address: '辦公地址', wechat: '微信聯絡', contactPending: '聯絡資料將於企業資料確認後公佈。', qrAlt: '企業微信聯絡二維碼',
  breadcrumb: '目前位置', back: '返回列表', updated: '更新日期', fallback: '此內容暫無目前語言版本，以下為該語言的欄目內容。', empty: '內容準備中。',
  caseDescription: '了解真實項目中的思考與實踐。', newsDescription: '關注企業動態與最新分享。',
  privacyTitle: '私隱聲明', privacyLead: '我們尊重你的私隱，並盡量減少網站對個人資料的處理。',
  privacySections: [
    { title: '網站收集甚麼', body: '本網站不提供註冊或網上表格，不設分析或廣告 Cookie。點擊電郵或電話連結，將由你的裝置開啟相應應用程式。' },
    { title: '存取紀錄', body: '伺服器或 CDN 可能記錄 IP 位址、存取時間、請求路徑與瀏覽器資料，以作維護及保安用途。正式上線前，網站營運者須在此列明實際服務商、保存期限及處理依據。' },
    { title: '主動聯絡', body: '你透過電郵、電話或微信主動提供的資料，將由企業經相應渠道處理。正式上線前，須補充處理目的、保存期限及個人資料權利的聯絡渠道。' },
  ],
  privacyPending: '此聲明尚待營運者確認，不能作為正式發佈版本。',
  notFound: '暫時找不到這一頁。', notFoundDescription: '連結可能已更新，或頁面尚未發佈。你可以返回首頁繼續探索。', backHome: '返回首頁',
  artAlt: '由幾何建築與連接線組成的抽象插畫', related: '繼續探索',
};
const en: Copy = {
  home: 'Home', about: 'About us', services: 'What we do', cases: 'Our work', news: 'Insights', contact: 'Contact us', privacy: 'Privacy',
  skip: 'Skip to content', menu: 'Navigation menu', language: 'Choose language', close: 'Close menu',
  preview: 'Website preview · Brand and business content awaiting review', previewDetail: 'Illustrative content only. This is not a statement of an actual company’s services.',
  eyebrow: 'CONNECT. COLLABORATE. MOVE FORWARD.', heroLine1: 'Shared ambition.', heroLine2: 'New possibilities.',
  heroDescription: 'Every meaningful partnership starts with understanding. A thoughtful conversation. A clear direction. A way forward, together.',
  explore: 'Explore our services', talk: 'Let’s talk', scroll: 'Explore below',
  introLabel: 'OUR PERSPECTIVE', introTitle: 'Understand today.\nSee beyond tomorrow.',
  introDescription: 'Good collaboration starts with listening. Clear communication and practical thinking help turn an initial idea into a shared plan of action.',
  aboutLink: 'Get to know us', servicesLabel: 'WHAT WE DO', servicesTitle: 'From ideas to action.', servicesDescription: 'A considered approach, with a clear focus at every stage.',
  allServices: 'Explore all services', detail: 'Explore service', sample: 'Illustrative service',
  approachLabel: 'HOW WE WORK', approachTitle: 'Thoughtful thinking.\nClear collaboration.',
  steps: [
    { title: 'Listen & understand', description: 'Start with your goals and context to identify the challenge that matters.' },
    { title: 'Shape & collaborate', description: 'Turn needs into a shared scope, priorities, and an actionable direction.' },
    { title: 'Progress & communicate', description: 'Review progress at agreed milestones and use feedback to move forward.' },
  ],
  ctaLabel: 'IT STARTS WITH A CONVERSATION', ctaTitle: 'The next possibility\nstarts with you.', ctaDescription: 'We welcome your questions, ideas, and ambitions.',
  footerNote: 'Clear communication. Lasting connections.', navigation: 'Explore', connect: 'Connect', copyright: 'All rights reserved.',
  aboutTitle: 'Understanding comes first.', aboutDescription: 'We believe meaningful collaboration begins with an open conversation and a shared sense of direction.',
  aboutBody: 'This space will introduce the company’s verified background, expertise, and team. Replace this preview with approved company information before publication. Credentials, milestones, and client details should only appear once confirmed.',
  valuesTitle: 'A shared goal. A clear way forward.', values: [
    { title: 'Understand the need', description: 'Learn the context before discussing solutions.' }, { title: 'Collaborate clearly', description: 'Agree on scope, pace, and expectations.' }, { title: 'Keep the conversation going', description: 'Use feedback to improve how we work together.' },
  ],
  contactTitle: 'A conversation.\nA new beginning.', contactDescription: 'Choose the way to connect that works best for you.',
  email: 'Email', phone: 'Phone', address: 'Office', wechat: 'WeChat', contactPending: 'Contact details will be available once company information is confirmed.', qrAlt: 'Company WeChat contact QR code',
  breadcrumb: 'Breadcrumb', back: 'Back to overview', updated: 'Updated', fallback: 'This content is not yet available in this language. Explore the available content below.', empty: 'Content is on its way.',
  caseDescription: 'Explore the thinking behind real projects.', newsDescription: 'Company updates and fresh perspectives.',
  privacyTitle: 'Privacy notice', privacyLead: 'We respect your privacy and aim to minimise personal information processing on this website.',
  privacySections: [
    { title: 'What this website collects', body: 'This website has no registration or online forms and sets no analytics or advertising cookies. Email and phone links open the corresponding application on your device.' },
    { title: 'Access logs', body: 'The hosting provider or CDN may record IP addresses, access times, requested paths, and browser information for operation and security. Before launch, the operator must specify the actual providers, retention periods, and grounds for processing here.' },
    { title: 'When you contact us', body: 'Information you voluntarily provide by email, phone, or WeChat is handled through those channels. Before launch, specify the purposes, retention periods, and contact channel for privacy requests.' },
  ],
  privacyPending: 'This notice requires operator review and is not ready for publication.',
  notFound: 'A little off the beaten path.', notFoundDescription: 'The link may have changed, or the page may not be published yet. Head home to keep exploring.', backHome: 'Back to home',
  artAlt: 'Abstract illustration of architectural forms and connecting lines', related: 'Keep exploring',
};
export const copy: Record<Locale, Copy> = { 'zh-cn': cn, 'zh-hk': hk, en };
