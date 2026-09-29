# 闵灿 · 个人作品集网站

环境艺术设计 / 视觉艺术设计 / 概念艺术设计 —— 单页作品集，PC 优先，版心 1700px。
技术栈：**React 18 + Vite 5**，零 UI 依赖，滚动动效全部手写。

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
| 01 全屏首页 | `src/components/Hero.jsx` | 视频背景 + 大标题 + 导航 + 联系按钮 + 数据条 |
| 02 个人经历 | `src/components/About.jsx` | 人物图、头像名片、介绍、联系方式、数据、经历 / 教育 / 获奖时间轴 |
| 03 精选项目 | `src/components/Projects.jsx` | 6 张大卡片 + 设计主张卡片 + 关键词跑马灯 + 成果集锦 |
| 04 个人优势 | `src/components/Strengths.jsx` | 6 张能力卡片 + 工具熟练度条 |
| 05 联系方式 | `src/components/Contact.jsx` | 整屏收尾页，大标题 + 邮箱 + 电话 + 简历下载 |

配色为高级灰 / 莫兰迪：中性灰底（`--paper` `#E8E5E0`）配陶土、蓝灰、雾绿、
紫灰四个低饱和点缀色（`--clay` `--steel` `--sage` `--lilac`）。
所有设计变量集中在 `src/styles/global.css` 顶部的 `:root`，改配色只动那一块即可。

---

## 首页视频背景

Hero 默认用 4 张项目渲染图做缓慢交叉淡入 + 视差，效果接近视频。
想换成真正的视频，把文件放到：

```
public/media/hero-loop.mp4
```

文件名保持 `hero-loop.mp4` 即可——页面会自己探测到它并自动播放（静音、循环、
内联播放），探测不到就继续用图片轮播，不会出现损坏的播放器。

建议：1920×1080 以上、8–15 秒无缝循环、H.264 MP4、体积控制在 8MB 以内。

---

## 内容与素材

所有文案、时间轴、项目与奖项数据集中在 **`src/data/site.js`**，改文字不用碰组件。

- `profile` 姓名 / 身份 / 邮箱 / 电话 / 所在地 / 求职意向
- `education` `experience` `awards` 经历与荣誉
- `projects` 精选项目（标题、副标题、标签、年份、图片、描述）
- `strengths` `toolStack` 能力卡片与软件熟练度
- `gallery` 成果集锦缩略图
- `navItems` 导航与侧边章节

图片放在 `public/media/`，均由简历与作品集原始文件导出为 WebP：

| 文件 | 用途 |
| --- | --- |
| `hero-01 … 04.webp` | 首页轮播画面 |
| `portrait.webp` / `avatar.webp` | 个人经历人物图 / 导航名片头像 |
| `p-01 … p-06.webp` | 精选项目大卡片 |
| `g-01 … g-08.webp` | 成果集锦缩略图 |

替换图片时保持同名即可，无需改代码。

---

## 交互细节

- 顶部滚动进度条、导航吸顶毛玻璃、右侧章节指示器（≥1360px 显示）
- 所有区块滚动入场（`IntersectionObserver`，尊重 `prefers-reduced-motion`）
- 首页鼠标视差、导航锚点平滑滚动、项目卡片灰度 → 彩色悬停
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
   │  ├─ Nav.jsx  Hero.jsx  About.jsx
   │  ├─ Projects.jsx  Strengths.jsx  Contact.jsx
   │  ├─ SectionHead.jsx  Rail.jsx
   └─ styles/global.css
```
