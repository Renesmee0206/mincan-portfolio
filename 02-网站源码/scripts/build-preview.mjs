#!/usr/bin/env node
/**
 * 把 02-网站源码 打包成 01-网站预览 —— 「双击 index.html 就能看」的那一套。
 *
 * 用法（在 02-网站源码 目录里执行）：
 *   node scripts/build-preview.mjs
 *
 * 做四件事：
 *   1. 用 esbuild 把 src 打成一个 bundle.js（IIFE，普通 <script> 即可加载，file:// 下也能跑）
 *   2. 把资源路径改成预览文件夹内部的相对路径（图片、视频、简历都放进预览文件夹，自成一套）
 *   3. 复制 styles/global.css
 *   4. 复制 public/media（图片 + 视频）、favicon.png、resume.pdf
 *
 * 注意：网站上线的 GitHub Pages 用的就是 01-网站预览 这个文件夹，改完内容记得重新跑一次本脚本。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const src = path.resolve(here, '..')
const repo = path.resolve(src, '..')
const out = path.join(repo, '01-网站预览')

/** esbuild 的定位：正常安装 (node_modules/esbuild) → pnpm 的 .pnpm 目录 */
async function loadEsbuild() {
  pointToEsbuildBinary() // 必须在 import 之前设置，esbuild 在模块加载时读取这个变量
  try {
    return await import('esbuild')
  } catch {}
  const pnpmDir = path.join(src, 'node_modules', '.pnpm')
  if (fs.existsSync(pnpmDir)) {
    const hit = fs
      .readdirSync(pnpmDir)
      .filter((name) => name.startsWith('esbuild@') && !name.includes('win32'))
      .map((name) => path.join(pnpmDir, name, 'node_modules', 'esbuild', 'lib', 'main.js'))
      .find((file) => fs.existsSync(file))
    if (hit) return await import(pathToFileURL(hit).href)
  }
  throw new Error('找不到 esbuild，请先在 02-网站源码 里执行一次 pnpm install')
}

/** 有些环境里 esbuild 的平台二进制包没被正确链接，这里直接指定可执行文件 */
function pointToEsbuildBinary() {
  if (process.env.ESBUILD_BINARY_PATH) return
  const bin = process.platform === 'win32' ? 'esbuild.exe' : 'esbuild'
  const candidates = [path.join(src, 'node_modules', 'esbuild', 'bin', bin)]
  const pnpmDir = path.join(src, 'node_modules', '.pnpm')
  if (fs.existsSync(pnpmDir)) {
    for (const name of fs.readdirSync(pnpmDir)) {
      if (name.startsWith('esbuild@') && !name.includes('win32') && !name.includes('linux')) {
        candidates.push(path.join(pnpmDir, name, 'node_modules', 'esbuild', 'bin', bin))
      }
      if (name.startsWith('@esbuild+') && (name.includes('win32') || name.includes('linux'))) {
        candidates.push(path.join(pnpmDir, name, 'node_modules', '@esbuild', name.split('+')[1].split('@')[0], bin))
      }
    }
  }
  const hit = candidates.find((file) => fs.existsSync(file))
  if (hit) process.env.ESBUILD_BINARY_PATH = hit
}

const esbuild = await loadEsbuild()

const tmp = path.join(src, 'node_modules', '.cache')
fs.mkdirSync(tmp, { recursive: true })
const tmpBundle = path.join(tmp, 'preview-bundle.js')

await esbuild.build({
  entryPoints: [path.join(src, 'src', 'main.jsx')],
  bundle: true,
  format: 'iife',
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' },
  outfile: tmpBundle,
  logLevel: 'warning',
})

// 路径改写：预览文件夹里的资源全部用相对路径。
// 视频要放在最前面处理，否则会被后面的 /media/ 规则先改写掉。
const videoFiles = ['video-juyi.mp4', 'video-cruise.mp4', 'hero-loop.mp4']
let code = fs.readFileSync(tmpBundle, 'utf8')
for (const file of videoFiles) {
  code = code.split('"/media/' + file + '"').join('"media/' + file + '"')
}
code = code.split('/media/').join('media/') // 图片、二维码
code = code.split('"/resume.pdf"').join('"resume.pdf"')

fs.mkdirSync(out, { recursive: true })
fs.writeFileSync(path.join(out, 'bundle.js'), code, 'utf8')

const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to)
}

copy(path.join(src, 'src', 'styles', 'global.css'), path.join(out, 'styles', 'global.css'))
copy(path.join(src, 'public', 'favicon.png'), path.join(out, 'favicon.png'))
copy(path.join(src, 'public', 'resume.pdf'), path.join(out, 'resume.pdf'))

const mediaDir = path.join(src, 'public', 'media')
for (const file of fs.readdirSync(mediaDir)) {
  const from = path.join(mediaDir, file)
  if (fs.statSync(from).isFile()) copy(from, path.join(out, 'media', file))
}

fs.writeFileSync(
  path.join(out, 'index.html'),
  `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1440" />
    <link rel="icon" type="image/png" href="favicon.png" />
    <meta name="theme-color" content="#141517" />
    <meta name="description" content="闵灿 · 环境艺术设计 / 视觉艺术设计 / 概念艺术设计 —— 个人作品集" />
    <title>闵灿 · 个人作品集 | 环境艺术 / 视觉艺术 / 概念艺术</title>
    <link rel="stylesheet" href="styles/global.css" />
  </head>
  <body>
    <div id="root"></div>
    <script src="bundle.js"></script>
  </body>
</html>
`,
  'utf8',
)

// GitHub Pages 不需要跑 Jekyll
fs.writeFileSync(path.join(out, '.nojekyll'), '')

console.log('✓ 预览已更新：' + out)
