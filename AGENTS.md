# Prototype Instructions

## 用户已确认的设计要求
- 以所提供的 Cinematic Space-Travel 页面说明为视觉与交互依据：原视频、纯黑底、无暗色遮罩、液态玻璃、居中标题、两屏全幅背景、逐字模糊入场和手动视频渐隐循环。
- 不再采用此前生成的家居风静态稿。个人信息与海尔真实作品保持准确，作品原图不可覆盖。
- 使用 Vite + React，中文为主；参考规定的 Instrument Serif 斜体用于英文展示字，中文使用可读的衬线字体补全。
- 所有补做过程结构图标注为设计复盘，不编造业绩或原项目AI使用记录。
- “关于我＋联系我”整屏放在首屏之后，作为页面第二屏。
- “关于我”左侧标题下使用用户提供的方形自拍照，保持真实人像比例，不做AI替换。
- 联系卡片边框采用随鼠标靠近边缘出现的方向性光效，参数参照 React Bits Border Glow：30px 圆角、58px 光晕、2.2 强度、31 边缘灵敏度。
- 自拍卡片采用 React Bits Spotlight Card 式的鼠标跟随光斑，保持照片原有尺寸、裁切与真实内容。
- “关于我”两段中文介绍使用左右对齐；个人能力卡片展示用户提供的 AI 软件清单：PS-AI、GPT、CODEX、CLAUDE-CODE、GMINI、LOVART、DEEPSEEK、即梦、豆包。
- “设计过程 / Case Study”区域使用网站自有的浅棕、米黄、暖金动态渐变作为不拦截交互的响应式背景，并保持深色遮罩确保文字可读。

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
