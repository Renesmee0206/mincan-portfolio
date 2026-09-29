# 闵灿 · 个人作品集网站

环境艺术设计 / 视觉艺术设计 / 概念艺术设计 —— 单页作品集网站。
技术栈：React 18 + Vite，零 UI 依赖，滚动动效全部手写；**PC 优先，版心 1700px**。

线上地址：

- GitHub Pages：`https://renesmee0206.github.io/mincan-portfolio/`
- 国内正式站（腾讯云 EdgeOne Pages）：见控制台里的 `xxx.edgeone.app` 域名

> 两个站点的配置、差异、踩过的坑和日常更新流程，都记在 **[`DEPLOY.md`](DEPLOY.md)** 里。

---

## 一、这个文件夹里有什么

| 文件夹 / 文件 | 说明 |
| --- | --- |
| `01-网站预览/` | **线上发布的就是这一套**：双击 `index.html` 就能看的完整网站，图片、视频、简历都在里面，自成一套、不依赖别处 |
| `02-网站源码/` | 网站源码（React + Vite）。文字在 `src/data/site.js`，样式在 `src/styles/global.css`，图片视频在 `public/media/` |
| `03-页面截图/` | 7 张页面效果图（首页 / 个人经历 / 精选项目 / 项目详情 / 成果集锦 / 联系方式 / 视频页） |
| `04-原片备份/` | 视频原片与更新前的版本，**不会上传** GitHub（`.gitignore` 已排除） |
| `说明-先看我.md` | 面向你的中文说明（怎么看、怎么改） |
| `DEPLOY.md` | 部署与更新手册：两个站点各自怎么配的、怎么更新、出问题怎么查、怎么回退 |
| `作品集.pptx` `作品集2.pptx` `简历闵灿.pdf` | 原始素材，同样不会上传 GitHub |

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
> 它和 GitHub Pages 的内容来源不同，细节见 **[`DEPLOY.md`](DEPLOY.md)**。

---

## 五、一些说明

- **不上传的内容**：两个 PPTX、简历原件、`04-原片备份/`（视频原片）、`node_modules`。原因：体积大（PPTX 单个 160–360MB，超过 GitHub 单文件 100MB 的限制），且含有个人信息，网站运行也用不到。
- **视频**：`01-网站预览/media/video-juyi.mp4`（25.4MB）与 `video-cruise.mp4`（21.1MB），已压缩到适合网页播放的体积。
- **简历下载**：网站上的「下载简历 PDF」读的是 `01-网站预览/resume.pdf`，换简历时替换这个文件（以及 `02-网站源码/public/resume.pdf`）即可。
- **首页轮播**：`02-网站源码/public/media/hero-01…10.webp`，每 4 秒切换一张，鼠标移动会有轻微视差。
- 想换配色 / 字号：`02-网站源码/src/styles/global.css` 顶部的 `:root` 变量。
