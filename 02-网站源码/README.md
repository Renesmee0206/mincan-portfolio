# 闵灿 · 个人作品集网站

环境艺术设计 / AI 设计 / 概念艺术设计 —— 单页作品集，版心 1700px，桌面 / 手机都做了适配。
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
| 01 全屏首页 | `src/components/Hero.jsx` | Prism 极光背景 + 大标题（压在作品流之上）+ 按钮下一行英文 motto（`profile.motto`）+「What I like」可拖动画作流（`FlexCarousel.jsx`） |
| 02 个人经历 | `src/components/About.jsx` | **左栏 = 个人照片墙**（13 张，`InfiniteSpiral.jsx` + `PhotoLightbox.jsx`，一直在自己转）、右栏介绍 / 联系方式 / 数据、经历 / 教育 / 获奖时间轴 |
| 03 精选项目 | `src/components/Projects.jsx` | 6 张大卡片 + 设计主张卡片 + 关键词跑马灯 + 成果集锦（`BounceCards.jsx`，可洗牌） |
| 04 联系方式 | `src/components/Contact.jsx` | 整屏收尾页，大标题 + 邮箱 + 电话 + 简历下载；右侧信息卡是「电话 / 所在地 / 求职意向 / 教育背景 / Status / 简历」六格，值都取 `profile` |
| — 板块过场 | `src/components/ChapterDivider.jsx`（内用 `ScrollFloat.jsx`） | **一整屏的黑**，中间一行英文大字：`About & Experience` / `Selected Projects` / `Contact`，滚到跟前逐字浮上来，浮完跟着滚出上边 |

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
  - 素材是牛皮纸箱特写 + 一块深红底，4:3 比大多数屏幕窄，**放不满的边补成黑边**
    （`.intro__stage` 的底色 `#0b0b0d`）。宽屏上视频 `object-fit: contain` 靠右贴边，
    竖屏则 `cover` 铺满。
  - 左边那条黑边同时当**快递单**用：`.intro__from` 里两行折字，`FROM: MIN CAN.` +
    `Please claim your exclusive parcel.`（第二行晚 320ms）。只在 `min-aspect-ratio: 8/5`
    以上显示——窄屏没有黑边，放上去会压到纸箱。
- 折字：`src/components/FoldText.jsx`（来自 reactbits.dev/text-animations/fold-text），
  依赖 `gsap`，用的是 `trigger="mount"`——**不要改成 `scroll`**，黑场里页面是锁滚动的，
  scroll 永远不触发，会变成全黑一片。
- 文案：「欢迎来到闵灿的频道」+ `WELCOME TO MY CHANNEL`，都在 `Intro.jsx` 里。
- 撕纸音效是浏览器现场合成的（Web Audio，白噪声 + 带通滤波），没有音频文件；
  不想要就删掉 `Intro.jsx` 里的 `createTearSound()` 和它的 3 处调用。
- ⚠️ **`poster` + `wakeVideo()` 不能删**：iOS / 微信内置浏览器的 webview 里，
  **没播放过的 `<video>` 一帧都不画**（整屏黑），只 seek 也没用 —— 手机上进开场会全黑，
  拖了看不到纸箱。所以：`poster="media/intro-poster.webp"`（视频第 0 帧，抽帧脚本
  `.codex-build/make-intro-poster.mjs`）负责「还没出画面时显示纸箱」；
  `autoPlay` + `wakeVideo()`（播一下立刻暂停）负责把解码器叫醒，
  自动播被拦时等 `onPointerDown` 那次真手势再试。回归探针：`.codex-build/site-check/intro-touch.mjs`。
- **拖拽不要改回 state 驱动**：进度是 `pointermove` 里直接写 DOM（拉条 + 百分比），
  视频 seek 由一条常驻 rAF 循环每帧最多写一次；`.intro__bar i` 也**不加 transition**。
  这两处任何一处改回「setState + useEffect」或加缓动，拉条就会明显慢半拍。
- 每次进站都会播（没有用 sessionStorage 记住）。

---

## 首页「What I like」

首屏的主角是一条可以**按住拖动**（手机上左右滑动）的作品流，按画幅节奏排 7 件影响我的
作品 / 影像：齐马蓝、天气计划、雨屋、电视佛、沙丘、下一层、剧院。
点一下会把这件作品放大聚焦，卡片下面那条跟着显示题名、作者（原文名）和 `01 / 07` 序号。

**版面关系（这一屏的关键）**：作品流是面积最大的一层，**往上顶到名字块后面**——
「闵灿 / MIN CAN」、三个专业、两个按钮整块压在卡片上（左边信息遮挡卡片，是刻意做的构图）。
实现是 `.hero__rail` 的一个负 `margin-top`（`-288px`，8px 基线的整数倍）：
它的底边由外层 flex 定死，所以这个值只改卡片的顶边。左边还有一层横向渐隐
（`.hero__rail::before`），保证压在上面的文字始终读得清——**只压左边那一竖条
（0→26% 最深，58% 起完全透明），卡片中间和右边不加任何遮罩**。
另外背景是 React Bits 的 **Prism**（`src/components/Prism.jsx`，WebGL，用 `ogl`），
慢慢旋转的极光，透过 `.hero__scrim` 看得到；系统开了「减少动态效果」就不挂载它。
`.hero__scrim` 底部那条竖向压暗压在内容层下面，只压暗 Prism 的亮斑（保证底部题名读得清），
卡片和文字都在它上面。

- 组件：`src/components/FlexCarousel.jsx`（来自 reactbits.dev，`preset="liquid"`，
  用 `ogl` 做 WebGL 变形）；页面上关闭了滚轮捕捉，所以在作品流上滚滚轮照样能翻页面。
- 底部中间那条**「继续了解我」指引**（`.hero__next`）：双箭头 + 一行小字，
  箭头用 `nextNudge` 一直往上弹（回弹靠 `cubic-bezier(.34,1.56,.64,1)`），
  点一下平滑滚到「个人经历」。原来右下角那条「SCROLL」已被它取代。
- 数据：`src/data/site.js` 的 `likes`（`src` / `title` / `subtitle` / `alt`）。
- 素材：`素材与原件/首页图片/` 里的 7 张原图 → 转成 `public/media/like-0N-*.webp`
  （宽高 1200 以内、WebP q84）。
- 卡片尺寸：`cardHeight={0.73}`（占轨道高度的 73%）。轨道下限
  `clamp(340px, 46svh, 560px)`——觉得卡片还要更大/更小，改这两个数就行。
- ⚠️ 重新打包时 `scripts/build-preview.mjs` 会把这 7 张图**内联成 data URL** 写进
  `bundle.js`：`file://` 直接双击打开时，浏览器把本地图片算跨域，WebGL 传不进纹理，
  不内联首屏就是一排灰块。别改成引用本地文件路径。

---

## 内容与素材

所有文案、时间轴、项目与奖项数据集中在 **`src/data/site.js`**，改文字不用碰组件。

- `profile` 姓名 / 身份 / 邮箱 / 电话 / 所在地 / 求职意向（`intent`）/ 状态（`status`）/ 首页那句话（`motto`）
- `likes` 首页「What I like」的 7 件作品 / 影像（`heroStats` 已不在首页使用，留给以后）
- `education` `experience` `awards` 经历与荣誉
- `projects` 精选项目（标题、副标题、标签、年份、图片、描述；`detail` 就是该项目的细节图）
- `galleryPool` 成果集锦的图片池 —— 由各项目的 `detail` 自动拼出来，不单独养素材
- `navItems` 导航与侧边章节

图片放在 `public/media/`，均由简历与作品集原始文件导出为 WebP：

| 文件 | 用途 |
| --- | --- |
| `intro-open.mp4` | 开场动画：牛皮纸快递盒撕裂特写 |
| `like-01 … like-07.webp` | 首页「What I like」作品流（源图在`素材与原件/首页图片/`，打包时内联进 bundle） |
| `portrait.webp` / `avatar.webp` | 照片墙里那张拿相机的肖像 / 导航名片头像 |
| `me-01 … me-12.webp` | 个人经历照片墙（源图在 `素材与原件/个人图片/`，脚本 `.codex-build/build-people.py`，长边 1000 / WebP q80） |
| `p-01 … p-06.webp` | 精选项目大卡片 |
| `d-01-1 … d-06-7.webp`（03 / 04 排到 `-8`） | 项目细节图（同时也是成果集锦的图片池，共 43 张） |

替换图片时保持同名即可，无需改代码。

> 项目图（`p-*` / `d-*`）是从`素材与原件/项目图片/` 里重出的：长边 1800、WebP q82，
> 六个项目各一个文件夹。重出脚本是 `.codex-build/rebuild-media.py`（不在仓库里）。

> 网站上的「下载简历 / 下载 PDF」指向 `public/resume.pdf`（重新打包会复制到
> `01-网站预览/resume.pdf`）。换简历：把新的 PDF 放到仓库根目录、命名 `简历-闵灿.pdf`，
> 再跑 `.codex-build/compress-resume.py`——它会缩到 300 DPI（A4）重新嵌回去，
> 4.5MB 的原文件能压到 0.9MB 左右，打印依然清楚。源文件不会被改动。

---

## 成果集锦（BounceCards）

`src/components/BounceCards.jsx` —— 参考 React Bits 的 BounceCards 写的：
一叠 5 张（容器窄于 620px 时用 3 张那套落位）扇形摊开，
gsap `elastic.out(1, 0.5)` 弹入（`IntersectionObserver`，滚进视口才播），
hover 把两边推开、当前那张摊平并放大一点点。**卡片是彩色的**，没有灰度滤镜。

- 每张卡是 `<button>`，键盘 Tab / 回车能走，点一下滚回它所属的项目卡片并高亮。
- 数据来自 `site.js` 的 `galleryPool`（= 6 个项目的细节图，43 张）。
  「洗牌换一组」在 `Projects.jsx` 的 `drawHand()`：整池洗乱后按顺序取，
  **同一个项目最多 2 张**；换一组会换 `key` 让卡片重新弹一次。
- ⚠️ `.bounce__slot`（定位盒子）必须保持 `pointer-events: none`：
  五张卡片的定位盒子都叠在容器中心，不关掉的话会抢走真实鼠标的 hover 和点击。
- 入场动画作用在 `.bounce__slot` 上（只有 gsap 碰它的 `transform`），
  hover 那个 `transform` 在里面的 `.bounce__card` 上（只有 CSS transition 碰）——
  两者分开才不会互相覆盖，改的时候别合并。

---

## 个人照片墙（InfiniteSpiral）

`src/components/InfiniteSpiral.jsx` —— React Bits 的 InfiniteSpiral（JS + CSS 变体）：
**就放在个人经历左栏**（`.about__wall`）：**13 张**（第一张是拿相机那张
`portrait.webp`，后面 12 张生活照）排成一条一直在自转的螺旋，按住可以上下拖着看，
点一张由 `PhotoLightbox.jsx` 放大到屏幕中间，再点一下缩回。

- 照片：`public/media/me-01…12.webp`，源图在 `素材与原件/个人图片/`，重出脚本
  `.codex-build/build-people.py`（长边 1000 / WebP q80，顺带读 EXIF 转正）。顺序写在脚本的 `ORDER` 里。
  拿相机那张不在这儿——它复用站里早就有的 `portrait.webp`（`site.js` 里排在 `personalPhotos` 第一位）。
- 卡片形状和 hover：外层 `.infinite-spiral__item` 的 `transform` 每帧被 rAF 改写，
  圆角 / 描边 / 略微放大只能挂在内层 `.infinite-spiral__frame` 上——写外层会被覆盖。
- 拖动是「按下后移开 5px」才开始的：注册表原来在 `pointerdown` 就 `setPointerCapture`，
  普通点击会被当成拖动、卡片上的 `onClick` 被改派走（点不开大图）。
  **而且必须「按着」才算拖**（`pointerDownRef`）：只记按下点位置的话，松手后鼠标划过
  照片墙会把它带走、自动流动也一起停掉（点开大图退出来最容易触发）。
- `pauseOnHover={false}` 是刻意的：要一直自动流动，鼠标停在墙上也不停；
  悬停哪一张，那一张才放大 + 描边。想「停住方便点」改成 `true`。
- 手机上 `touch-action` 保持 `auto`、不接拖动，否则手指在照片墙上划不动页面
  （手机和桌面共用一套几何，半径按栏宽自动收口，手机上只留五六张）。
- 螺旋半径按 `width/2 - cardWidth*0.72` 收口，边上的卡片不会被舞台硬切；
  舞台上下有一层渐隐遮罩（`.wall__stage` 的 `mask-image`），两头是淡出而不是切断。

---

## 交互细节

- 顶部滚动进度条、导航吸顶毛玻璃、右侧章节指示器（≥1360px 显示）
- 所有区块滚动入场（`IntersectionObserver`，尊重 `prefers-reduced-motion`）
- 首页「What I like」拖拽 / 滑动 / 点击聚焦（滚轮不被吃，照样翻页）、导航锚点平滑滚动、
  项目卡片灰度 → 彩色悬停
- 首页底部「继续了解我」指引（箭头一直弹，点一下去个人经历）；
  成果集锦那一叠卡：hover 推开 / 「洗牌换一组」/ 点一张回到项目
- 板块之间的**英文过场**（React Bits 的 ScrollFloat，JS+CSS 变体）：
  一整屏的黑（`.chapter` 高 `100svh`），字滚到跟前逐字从下面浮上来
  （`scrub` 绑滚动进度，不是播完就完），浮到位时正好铺满一屏，再跟着滚出上边；
  系统开了「减少动态效果」时字直接显示
- 个人经历里的**照片墙**（React Bits 的 InfiniteSpiral，JS+CSS 变体）：
  12 张生活照排成一条缓慢自转的螺旋，鼠标停住就停、可以按住上下拖；
  **悬停略微放大 + 浮出一圈描边**（圆角），**点一张放大到屏幕中间看、再点一下缩回**
  （放大时 `← →` 换一张、`ESC` 收起）；手机上手指划过不挡页面滚动
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
   │  ├─ ChapterDivider.jsx  ScrollFloat.jsx  # 板块之间的英文过场（React Bits ScrollFloat）
   │  ├─ InfiniteSpiral.jsx  PhotoLightbox.jsx  # 个人经历的照片墙 + 点开看大图
   │  ├─ BounceCards.jsx             # 成果集锦那一叠卡（洗牌 + 弹入）
   │  ├─ Nav.jsx  About.jsx  Projects.jsx  ProjectDetail.jsx  Contact.jsx
   │  ├─ SectionHead.jsx  Rail.jsx
   └─ styles/global.css
```
