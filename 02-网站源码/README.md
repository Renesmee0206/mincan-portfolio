# 闵灿 · 个人作品集网站

环境艺术设计 / 视觉艺术设计 / 概念艺术设计 —— 单页作品集，版心 1700px，桌面 / 手机都做了适配。
技术栈：**React 18 + Vite 5**，只装了 gsap（开场折字用）与 ogl（首页作品流 + Prism 背景的
WebGL 渲染），滚动动效全部手写。

---

## 快速开始

```bash
pnpm install     # 或 npm install
pnpm dev         # http://localhost:5173
```

打包与本地预览：

```bash
pnpm build
pnpm preview
```

> 需要 Node 18+。项目用 pnpm 11 安装过，`pnpm-workspace.yaml` 里的
> `allowBuilds: esbuild` 是用来放行 esbuild 的安装脚本的，请不要删除；
> 如果你用 npm / yarn，这个文件会被忽略，不受影响。

---

## 页面结构

| 区块 | 组件 | 说明 |
| --- | --- | --- |
| 00 开场动画 | `src/components/Intro.jsx` | 拖拽撕开牛皮纸快递箱 → 黑场折字 → 进站（每次进站都播） |
| 01 全屏首页 | `src/components/Hero.jsx` | Prism 极光背景 + 大标题（压在作品流之上）+「What I like」可拖动画作流（`FlexCarousel.jsx`） |
| 02 个人经历 | `src/components/About.jsx` | 人物图、头像名片、介绍、联系方式、数据、经历 / 教育 / 获奖时间轴 |
| 03 精选项目 | `src/components/Projects.jsx` | 6 张大卡片 + 设计主张卡片 + 关键词跑马灯 + 成果集锦 |
| 04 联系方式 | `src/components/Contact.jsx` | 整屏收尾页，大标题 + 邮箱 + 电话 + 简历下载 |

配色为**暗色**：近黑留暖调（页面底 `--bg` `#0E0E10`、交替区块 `--bg-2` `#131316`、
卡面 `--bg-3` `#1A1A1F`），配陶土、蓝灰、雾绿、紫灰四个低饱和点缀色
（`--clay` `--steel` `--sage` `--lilac`），另有一档反相浅面 `--raise` `#F1EDE4`
专供主按钮、导航当前项、设计主张卡、二维码卡这类「暗色里的一处亮点」。
所有设计变量集中在 `src/styles/global.css` 顶部的 `:root`，改配色只动那一块即可。

> 手机端断点在 `global.css` 最下面的 `@media (max-width: 768px)` / `(max-width: 480px)`；
> `index.html` 的 viewport 是 `width=device-width, initial-scale=1`，别改回固定宽度。

---

## 开场动画（进站第一屏）

进站先播一段全屏牛皮纸快递盒视频，**按住向右拖动（手机上左右滑动）**控制撕裂进度，
撕到底后黑场淡入、折字浮出，点「确定」进站。Enter / 空格可以直接开箱，右上角有「跳过」，
系统开了「减少动态效果」时直接进站。

- 视频：`public/media/intro-open.mp4`（**1112×834，4:3** / 5.05s / 2.28MB，静音）
  ——换素材只要**同名替换**这个文件，再跑一次打包即可。
  - 素材是牛皮纸箱特写 + 一块**深红底**。4:3 比大多数屏幕窄，放不满的边用颜色补齐：
    `.intro__stage` 的底色是一条红色渐变（左端略暗 → 接缝处正好是视频左边缘的 `#982017`），
    宽屏上视频 `object-fit: contain` 靠右贴边，所以看不出接缝；竖屏则 `cover` 铺满。
  - 换一段比例不同的视频时：改 `.intro__stage` 的渐变颜色（照视频边缘取色），其余不用动。
- 折字：`src/components/FoldText.jsx`（来自 reactbits.dev/text-animations/fold-text），
  依赖 `gsap`，用的是 `trigger="mount"`——**不要改成 `scroll`**，黑场里页面是锁滚动的，
  scroll 永远不触发，会变成全黑一片。
- 文案：「欢迎来到闵灿的频道」+ `WELCOME TO MY CHANNEL`，都在 `Intro.jsx` 里。
- 撕纸音效是浏览器现场合成的（Web Audio，白噪声 + 带通滤波），没有音频文件；
  不想要就删掉 `Intro.jsx` 里的 `createTearSound()` 和它的 3 处调用。
- 每次进站都会播（没有用 sessionStorage 记住）。

---

## 首页「What I like」

首屏的主角是一条可以**按住拖动**（手机上左右滑动）的作品流，按画幅节奏排 7 件影响我的
作品 / 影像：齐马蓝、天气计划、雨屋、电视佛、沙丘、下一层、剧院。
点一下会把这件作品放大聚焦，卡片下面那条跟着显示题名、作者（原文名）和 `01 / 07` 序号。

**版面关系（这一屏的关键）**：作品流是面积最大的一层，**往上顶到名字块后面**——
「闵灿 / MIN CAN」、三个专业、两个按钮整块压在卡片上（左边信息遮挡卡片，是刻意做的构图）。
实现是 `.hero__rail` 的一个负 `margin-top`（`-288px`，8px 基线的整数倍）：
它的底边由外层 flex 定死，所以这个值只改卡片的顶边。卡片左上角还有一层径向渐隐
（`.hero__rail::before`），保证压在上面的文字始终读得清——只压暗左边一条，右边卡片照样亮。
另外背景是 React Bits 的 **Prism**（`src/components/Prism.jsx`，WebGL，用 `ogl`），
慢慢旋转的极光，透过 `.hero__scrim` 看得到；系统开了「减少动态效果」就不挂载它。

- 组件：`src/components/FlexCarousel.jsx`（来自 reactbits.dev，`preset="liquid"`，
  用 `ogl` 做 WebGL 变形）；页面上关闭了滚轮捕捉，所以在作品流上滚滚轮照样能翻页面。
- 数据：`src/data/site.js` 的 `likes`（`src` / `title` / `subtitle` / `alt`）。
- 素材：根目录 `首页图片/` 里的 7 张原图 → 转成 `public/media/like-0N-*.webp`
  （宽高 1200 以内、WebP q84）。
- 卡片尺寸：`cardHeight={0.8}`（占轨道高度的 80%）。轨道下限
  `clamp(340px, 46svh, 560px)`——觉得卡片还要更大/更小，改这两个数就行。
- ⚠️ 重新打包时 `scripts/build-preview.mjs` 会把这 7 张图**内联成 data URL** 写进
  `bundle.js`：`file://` 直接双击打开时，浏览器把本地图片算跨域，WebGL 传不进纹理，
  不内联首屏就是一排灰块。别改成引用本地文件路径。

---

## 内容与素材

所有文案、时间轴、项目与奖项数据集中在 **`src/data/site.js`**，改文字不用碰组件。

- `profile` 姓名 / 身份 / 邮箱 / 电话 / 所在地 / 求职意向
- `likes` 首页「What I like」的 7 件作品 / 影像（`heroStats` 已不在首页使用，留给以后）
- `education` `experience` `awards` 经历与荣誉
- `projects` 精选项目（标题、副标题、标签、年份、图片、描述）
- `gallery` 成果集锦缩略图
- `navItems` 导航与侧边章节

图片放在 `public/media/`，均由简历与作品集原始文件导出为 WebP：

| 文件 | 用途 |
| --- | --- |
| `intro-open.mp4` | 开场动画：牛皮纸快递盒撕裂特写 |
| `like-01 … like-07.webp` | 首页「What I like」作品流（源图在根目录 `首页图片/`，打包时内联进 bundle） |
| `portrait.webp` / `avatar.webp` | 个人经历人物图 / 导航名片头像 |
| `p-01 … p-06.webp` | 精选项目大卡片 |
| `g-01 … g-08.webp` | 成果集锦缩略图 |

替换图片时保持同名即可，无需改代码。

---

## 交互细节

- 顶部滚动进度条、导航吸顶毛玻璃、右侧章节指示器（≥1360px 显示）
- 所有区块滚动入场（`IntersectionObserver`，尊重 `prefers-reduced-motion`）
- 首页「What I like」拖拽 / 滑动 / 点击聚焦（滚轮不被吃，照样翻页）、导航锚点平滑滚动、
  项目卡片灰度 → 彩色悬停
- 整页叠加极细胶片颗粒，避免纯色背景发"平"

---

## 目录

```
portfolio-site/
├─ index.html
├─ package.json
├─ vite.config.js
├─ pnpm-workspace.yaml
└─ src/
   ├─ main.jsx
   ├─ App.jsx
   ├─ data/site.js          # 全部文案与数据
   ├─ hooks/
   │  ├─ useReveal.js       # 滚动入场
   │  └─ useScroll.js       # 滚动进度 / 当前章节
   ├─ components/
   │  ├─ Intro.jsx  FoldText.jsx     # 开场动画 + 折字
   │  ├─ Hero.jsx  FlexCarousel.jsx  # 首页 + 首页那条作品流（WebGL）
   │  ├─ Prism.jsx                   # 首页背景的极光（React Bits，WebGL）
   │  ├─ Nav.jsx  About.jsx  Projects.jsx  ProjectDetail.jsx  Contact.jsx
   │  ├─ SectionHead.jsx  Rail.jsx
   └─ styles/global.css
```
