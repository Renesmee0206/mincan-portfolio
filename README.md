# 闵灿 · 个人作品集网站

环境艺术设计 / AI 设计 / 概念艺术设计 —— 单页作品集网站（**暗色**）。
技术栈：React 18 + Vite，只装了 gsap（开场折字用），滚动动效全部手写；
版心 1700px，**桌面与手机都适配**。

线上地址：

- GitHub Pages：`https://renesmee0206.github.io/mincan-portfolio/`
- 国内正式站（腾讯云 EdgeOne Pages）：见控制台里的 `xxx.edgeone.app` 域名

> 两个站点的配置、差异、踩过的坑和日常更新流程，都记在 **[`网页端/部署手册.md`](网页端/部署手册.md)** 里。

---

## 一、这个文件夹里有什么

根目录按**三个方向**分区，另有三个「位置不能动 / 只放原图」的文件夹：

| 文件夹 / 文件 | 说明 |
| --- | --- |
| `网页端/` | **网页方向**：`部署手册.md`（两个站点怎么配、怎么更新、怎么回退）+ `页面截图/`（18 张效果图：开场 4 + 桌面 10 + 手机 4） |
| `PDF与PPT/` | **投递方向**：`闵灿作品集-2026.pdf`（45 页，33MB，能当邮件附件）+ `闵灿作品集-2026.pptx`（同内容可编辑母版）+ `45页预览/` + `旧版/` |
| `求职投递/` | **求职方向**：`简历闵灿.pdf` + `求职邮件话术.md`，含个人信息，**不会上传** GitHub |
| `01-网站预览/` | **线上发布的就是这一套**：双击 `index.html` 就能看的完整网站，图片、视频、简历都在里面，自成一套、不依赖别处 |
| `02-网站源码/` | 网站源码（React + Vite）。文字在 `src/data/site.js`，样式在 `src/styles/global.css`，图片视频在 `public/media/` |
| `素材与原件/` | `首页图片/`（首页「What I like」7 张原图）、`项目图片/`（六个项目原图）、`个人图片/`（个人经历照片墙的原图）、`原片备份/`（视频原片）。**不会上传** GitHub |
| `说明-先看我.md` | 面向你的中文说明（怎么看、怎么改） |

> `01-网站预览` 与 `02-网站源码` **必须留在根目录**：两个部署配置里写死的就是这两个路径
> （GitHub Actions 的 `path: 01-网站预览`、腾讯云的「目标目录 `/02-网站源码`」），搬走会让线上发布失败。

---

## 二、日常使用

**想看网站** → 打开 `01-网站预览/index.html`（双击即可，不用装任何东西）。

**想改文字** → 改 `02-网站源码/src/data/site.js`：项目、经历、奖项、联系方式全在这一个文件里。

**改完要更新预览** → 在 `02-网站源码` 目录里执行一次：

```bash
node scripts/build-preview.mjs
```

它会重新打包 `01-网站预览`（打包 + 资源路径处理 + 复制图片视频，一步到位）。
第一次使用前如果 `node_modules` 不存在，先在 `02-网站源码` 里执行 `pnpm install`。

---

## 二·五、作品集的 PDF / PPT 是怎么来的

`PDF与PPT/闵灿作品集-2026.pptx` 与 `PDF与PPT/闵灿作品集-2026.pdf` 不是手工排的，是按 `02-网站源码/src/data/site.js`
里的项目数据自动生成的：脚本读同一份数据、同一批图片，排成 **45 页**——
封面 → 目录 → **01 关于我**（个人简介·教育 / 实践经历 / 荣誉与专业技能）→
**02 AI 辅助与数字表达**（映岳·叠景、海上生明月、新疆水坝，外加一页 AI 工作流）→
**03 概念空间设计**（矩以构·聚以生、海南黎染美术馆）→ **04 个人网站与界面设计** →
**05 手绘与视觉表达** → **06 我能为团队带来什么** → 联系方式。项目说明、经历、奖项都是中英并置。

版面不是随手摆的：**12 栏网格（栏宽 74 / 栏间距 24 / 页边距 64）+ 8px 基线**，
字号取自一条 1.333 的几何级数；图纸类「证据图」一律 `contain` 不裁切，效果图才允许 `cover`。
版式规则来自两个 skill（`.codex-build` 之外的 `~/.codex/skills/` 里）：
`grid-systems`（Müller-Brockmann 网格系统）与 `magazine-portfolio-skill`（作品集图片落位与字体层级）。

所以**改了 `site.js` 里的文字或换了图片，作品集也要重出一次**，否则两边会对不上。
生成脚本放在 `.codex-build/`（已写进 `.gitignore`，不会上传）：

```bash
python .codex-build/assets2.py          # 备图：网站素材 + 从两张海报里节选图纸（要 Pillow）
node   .codex-build/build.mjs           # 出稿 + 出每页预览
python .codex-build/check_ratio.py ...  # 逐张核对图片有没有被拉伸
node   .codex-build/finalize.mjs        # 校验并写出最终 PPTX
```

> 这三步需要带上 Codex 运行时的 Node / Python 路径，直接用系统的 node 可能跑不起来；
> 嫌麻烦的话直接说「按网页重出一版作品集」就行。

页面的完整清单、配色与字体，记在 `说明-先看我.md` 里。

---

## 三、第一次部署到 GitHub Pages

### 1. 在 GitHub 上建一个仓库

- 打开 https://github.com/new
- Repository name 例如 `mincan-portfolio`（名字随意，会出现在网址里）
- **Public**（免费账号的 Pages 只支持公开仓库；私有仓库需要付费版）
- 不要勾选 “Add a README file”（我们本地已经有 README 了）

### 2. 把本地这个文件夹推上去

在 `C:\Users\Renesmee\Desktop\闵灿作品集` 里打开 PowerShell / 终端，执行：

```bash
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

（仓库和第一次提交已经由我准备好，只要把上面 `<你的用户名>`、`<仓库名>` 换成你自己的即可。
推送时会弹出 GitHub 登录窗口，用浏览器登录授权一次就行。）

### 3. 打开 GitHub Pages

在仓库页面里：`Settings` → 左侧 `Pages` → **Build and deployment** → `Source` 选 **GitHub Actions**。

### 4. 等它自动发布

回到仓库的 `Actions` 标签页，会看到「发布网站到 GitHub Pages」在跑；跑完（约 1 分钟）后：

- 网址：`https://<你的用户名>.github.io/<仓库名>/`
- 也可以在 `Settings → Pages` 里看到 “Visit site”

> 网站内部所有图片、视频、简历都是**相对路径**，所以放在 `子路径`（`用户名.github.io/仓库名/`）下也能正常显示，
> 之后再绑定自己的域名同样不用改代码。

---

## 四、以后改了内容怎么更新线上

```bash
cd C:\Users\Renesmee\Desktop\闵灿作品集

# 1) 如果改的是源码，先重新生成预览（改的只是截图 / 说明文件可以跳过这步）
node 02-网站源码/scripts/build-preview.mjs

# 2) 提交并推送
git add -A
git commit -m "更新内容说明"
git push
```

推送完成后 GitHub Actions 会自动重新发布，大约 30 秒。也可以在 Actions 页面点 `Run workflow` 手动发布。

> 国内那个腾讯云站点也会同时自动重新部署（约 1–3 分钟），前提是上一步的 `build-preview.mjs` 已经跑过——
> 它和 GitHub Pages 的内容来源不同，细节见 **[`网页端/部署手册.md`](网页端/部署手册.md)**。

---

## 五、一些说明

- **不上传的内容**：`PDF与PPT/`、`求职投递/`、`素材与原件/`、`node_modules`。原因：体积大（可编辑母版约 399MB，超过 GitHub 单文件 100MB 的限制），且含有个人信息，网站运行也用不到。
- **视频**：`01-网站预览/media/video-juyi.mp4`（25.4MB）与 `video-cruise.mp4`（21.1MB），已压缩到适合网页播放的体积。
- **简历下载**：网站上的「下载简历 PDF」读的是 `01-网站预览/resume.pdf`，换简历时替换这个文件（以及 `02-网站源码/public/resume.pdf`）即可。
- **首页「What I like」**：进站第一屏的主角是一条可以**按住拖动 / 滑动**的作品流
  （React Bits 的 FlexCarousel，点一下会放大聚焦），按画幅节奏排 7 件：
  齐马蓝 / 天气计划 / 雨屋 / 电视佛 / 沙丘 / 下一层 / 剧院。
  它是这一屏面积最大的一层，「闵灿 / MIN CAN」那一块**压在卡片上面**（刻意做的遮挡）；
  左边一竖条有渐隐保证文字读得清，**卡片中间和右边没有任何遮罩**。
  数据在 `02-网站源码/src/data/site.js` 的 `likes`，源图在 `素材与原件/首页图片/`，
  网页用的是 `02-网站源码/public/media/like-0N-*.webp`。
  > 打包时这 7 张会**内联进 `bundle.js`**（data URL）：`file://` 下浏览器把本地图片算跨域、
  > WebGL 传不进纹理，不内联的话双击 `index.html` 首页会变成一排灰块。代价是 bundle 大 0.6MB。
- **首页背景动效**：React Bits 的 **Prism**（WebGL，`02-网站源码/src/components/Prism.jsx`），
  一层慢慢旋转的极光，透过首页的渐变看得到。系统开了「减少动态效果」会自动不挂载；
  想调浓淡改 `global.css` 里 `.hero__prism` 的 `opacity`。
- **开场动画**：进站先播 `01-网站预览/media/intro-open.mp4`
  （牛皮纸快递盒特写 + 深红底，1112×834，2.28MB）。
  按住向右拖动 / 手指左右滑动控制撕裂进度，撕到底进黑场、折字，点「确定」进站；
  Enter / 空格可直接开箱，右上角可「跳过」，系统开了「减少动态效果」则直接进站。
  黑场里的字是「欢迎来到闵灿的频道」。
  视频是 4:3，比大多数屏幕窄，**空出来的两侧补成黑边**（`.intro__stage` 用 `#0b0b0d`），
  左边那条黑边当快递单用：`FROM: MIN CAN.` + `Please claim your exclusive parcel.`
  两行都用和「欢迎来到闵灿的频道」一样的折字特效折出来（只在宽屏显示）。
  换素材只要同名替换 `02-网站源码/public/media/intro-open.mp4` 再跑一次打包。
- **暗色**：整站改成近黑留暖调（页面底 `#0E0E10`），配色变量集中在
  `02-网站源码/src/styles/global.css` 顶部的 `:root`。
- 想换配色 / 字号：`02-网站源码/src/styles/global.css` 顶部的 `:root` 变量。
