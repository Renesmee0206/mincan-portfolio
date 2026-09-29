# 部署与日常更新手册

> 记录「网站部署在哪、怎么配的、以后怎么更新、踩过哪些坑」，换电脑或过很久再看也够用。
> 最后更新：2026-09-29

---

## 一、线上有两个站点，内容来源不一样（重点）

| 站点 | 地址 | 内容来源 | 更新方式 |
| --- | --- | --- | --- |
| GitHub Pages | `https://renesmee0206.github.io/mincan-portfolio/` | 仓库里的 `01-网站预览/` 整个文件夹 | push 到 `main` 后自动发布，约 30 秒 |
| 腾讯云 EdgeOne Pages（国内，对外分享用这个） | 控制台里那个 `xxx.edgeone.app` 域名 | 平台自己从 `02-网站源码/` 现场构建（`npm install` + `npm run build` → `dist`） | push 到 `main` 后自动重新部署，约 1–3 分钟 |

**这条必须记住**：GitHub Pages 发的是「已经打包好的预览文件夹」，腾讯云发的是「现场从源码构建的产物」。
所以**改完源码一定要重新生成 `01-网站预览`**，否则会出现「腾讯云是新的、`github.io` 还是旧的」。

---

## 二、腾讯云 EdgeOne Pages 的配置（Git 平台部署）

| 字段 | 值 |
| --- | --- |
| 项目名称 | `mincan-portfolio` |
| Git 仓库 | GitHub / Renesmee0206（个人账户）/ `Renesmee0206/mincan-portfolio` / `main` |
| 项目模板 | 其他 |
| 环境版本配置 | Node.js 18 |
| 目标目录 | `/02-网站源码` |
| 安装命令 | `npm install` |
| 构建命令 | `npm run build` |
| 构建产物目录 | `dist` |
| 部署路径 | `/` |
| 环境变量 | 留空 |

**踩过的坑（2026-09-29）**：一开始按界面提示想走「零构建、直接发布」，把「构建产物目录」填成了 `/`，
部署立刻报错：

```
Error walking: /proc/tty/driver EACCES: permission denied, scandir '/proc/tty/driver'
```

原因是平台把 `/` 理解成了**操作系统的根目录**，从系统根开始遍历，撞上只有系统自己有权访问的 `/proc`。
改成上面这套「从源码构建 + 产物目录 `dist`」后一次成功，国内打开速度明显好于 `github.io`。

---

## 三、GitHub Pages 的配置

- 发布文件：`.github/workflows/deploy.yml`（push 到 `main` 自动触发，也可以在 Actions 页面点 `Run workflow` 手动发布）
- 发布内容：仓库里的 `01-网站预览/` 文件夹（`upload-pages-artifact` → `deploy-pages`）
- 仓库设置：`Settings` → `Pages` → **Build and deployment** → `Source` 选 **GitHub Actions**

**踩过的坑（2026-09-29）**：第一次 Actions 运行失败，报：

```
Get Pages site failed. Please verify that the repository has Pages enabled and configured to build using GitHub Actions...
```

原因是仓库当时还没开启 Pages、来源也不是 GitHub Actions，所以后面的「上传 / 部署」两步根本没执行，线上一直是 404。
解决：按上面把 Source 设成 GitHub Actions，再点 `Re-run all jobs`（第二次 27 秒成功）。

---

## 四、日常更新怎么做

```powershell
cd C:\Users\Renesmee\Desktop\闵灿作品集

# 1) 改了源码就重新生成预览（只改说明文件 / 截图可以跳过这步）
node 02-网站源码\scripts\build-preview.mjs

# 2) 提交并推送 —— 两个站点各自自动更新
git add -A
git commit -m "更新：xxx"
git push
```

推完之后：

- GitHub：仓库 → `Actions`，看到绿色对勾（约 30 秒）
- 腾讯云：控制台 → 部署记录 / 构建日志，出现新记录（约 1–3 分钟）
- 打开网址按 **Ctrl + F5** 强刷，避免浏览器拿旧缓存

### 改文字

只动 `02-网站源码/src/data/site.js`：项目、经历、奖项、联系方式全在这一个文件里。

### 换图片

把同名图片替换进 `02-网站源码/public/media/`，再跑一次 `build-preview.mjs`（脚本会把图片同步到 `01-网站预览/media/`）。
常用文件名：

| 用途 | 文件名 |
| --- | --- |
| 项目主图 | `p-01.webp` … `p-06.webp` |
| 项目细节图 | `d-01-1.webp` … `d-06-2.webp` |
| 首页轮播 | `hero-01.webp` … `hero-10.webp` |
| 成果集锦 | `g-01.webp` … `g-08.webp` |
| 人物图 / 头像 | `portrait.webp` / `avatar.webp` |

### 换简历

替换 `02-网站源码/public/resume.pdf` 和 `01-网站预览/resume.pdf`（跑一次脚本会自动同步），两个文件要一致。

### 换视频

- GitHub 单文件上限 **100MB**，超了就推不上去；网站上现在两个视频是 **25.4MB / 21.1MB**（已经压过）。
- 新视频建议先压到 1080p / 3–4 Mbps（或 720p），单文件控制在 40MB 以内。
- 原片放 `04-原片备份/`，那里不会上传 GitHub。

---

## 五、推送凭据

- 本机 Windows 凭据管理器里已经存了 `git:https://github.com`（用户 `Renesmee0206`），所以以后 `git push` 不用再登录。
- 换电脑或凭据失效时：在终端执行一次 `git push`，会弹 GitHub 登录窗口，用浏览器授权一次即可。

---

## 六、让 Codex 代劳（可选）

可以直接说：「把首页第 3 张轮播图换成新的，然后推上去」或者「把联系方式里的电话改成 xxx，推上去」。
Codex 会：改文件 → 跑 `build-preview.mjs` → `git add/commit/push` → 告诉你等多久、记得强刷。

只有两步需要你点一下授权：联网执行 `git push`（沙箱默认禁网）、以及重新生成 `03-页面截图/` 里的效果图（需要打开浏览器截图）。

---

## 七、出问题怎么查 / 怎么回退

- **GitHub 没更新**：仓库 → `Actions` 看有没有红色 ✗，点进去看报错原文。
- **腾讯云没更新**：控制台 → 部署记录；确认「推送代码时自动部署」是开着的，或手动点「重新部署」。
- **网页还是旧内容**：先 Ctrl + F5 强刷；再等 1–3 分钟（腾讯云要重新构建）。
- **想退回上一版**：`git log --oneline` 找到目标提交，`git revert <commit>` 再 push，两个站点都会回到那一版。
