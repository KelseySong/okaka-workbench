# Vlog Creator Workbench · 桌面版

> Vlog 创作工作台 — 跨平台桌面应用（macOS / Windows / Linux）

## ✨ 功能概览

| 工作区 | 说明 |
|--------|------|
| 🚢 **星际号航线** | 皇家加勒比海洋星际号 (Star of the Seas) 东西加勒比航线，8个港口档案 + 5个项目 |
| 🎬 **黑山短视频** | 黑山科托尔起步拍短视频，含完整策略页 + 5个选题 + 5个港口档案 |

每个工作区独立包含：仪表盘 / 项目看板 / 素材库 / 发布日历 / 港口档案 / 灵感速记

黑山工作区额外有 **起步策略页**：定位人设、平台策略、5个选题、设备清单、剪辑流程、30天行动计划

---

## 🚀 快速开始

### 方式一：直接用浏览器打开（最快）

不用安装任何东西，双击 `app/index.html` 即可在浏览器中使用，数据存在浏览器 localStorage。

### 方式二：打包成桌面应用（推荐）

#### 1. 安装 Node.js
去 [nodejs.org](https://nodejs.org) 下载 LTS 版本安装（如果已有可跳过）。

#### 2. 安装依赖

```bash
cd vlog-workbench-desktop/app
npm install
```

#### 3. 开发模式预览

```bash
npm start
```

这会打开桌面应用窗口，实时预览效果。

#### 4. 打包成安装文件

**macOS：**
```bash
npm run build:mac
```
生成 `.dmg` 文件在 `dist/` 目录，双击安装到「应用程序」。

**Windows：**
```bash
npm run build:win
```
生成 `.exe` 安装包在 `dist/` 目录。

**Linux：**
```bash
npm run build:linux
```
生成 `.AppImage` 文件，双击即可运行。

> ⚠️ macOS 打包需要 Mac 电脑，Windows 打包需要 Windows 电脑。跨平台打包需额外配置，建议在对应系统上操作。

---

## 📁 项目结构

```
vlog-workbench-desktop/
├── app/
│   ├── index.html       ← 工作台主体（HTML+CSS+JS 单文件）
│   ├── main.js          ← Electron 主进程
│   ├── preload.js       ← Electron 预加载脚本
│   └── package.json     ← 打包配置
├── build/
│   └── (放图标文件)
└── README.md
```

---

## 🎨 自定义

### 添加图标
把你的图标放到 `app/build/` 目录：
- macOS: `icon.icns` (512x512 或更大)
- Windows: `icon.ico` (256x256 或更大)
- Linux: `icon.png` (512x512)

### 添加新工作区
点击最左侧工作栏底部的 **+** 按钮，输入名称即可创建新工作区。每个工作区数据独立。

### 数据备份
- **导出**：左下角「导出」按钮 → 下载 JSON 文件
- **导入**：左下角「导入」按钮 → 选择之前导出的 JSON

数据存在本地，不上传任何服务器。建议定期导出备份。

---

## 🔧 技术栈

- **界面**：HTML5 + CSS3 + Vanilla JavaScript（无框架依赖）
- **桌面框架**：Electron 33
- **打包工具**：electron-builder
- **数据存储**：localStorage（浏览器本地）

---

## ❓ 常见问题

**Q: 打包后应用打不开？**
A: macOS 首次打开可能提示"无法验证开发者"，右键 → 打开 即可。Windows 同理，点击"仍要运行"。

**Q: 数据会丢失吗？**
A: 桌面版数据存在应用的 localStorage 中，卸载应用会清除。建议每周导出一次备份。

**Q: 可以在手机上用吗？**
A: 当前版本是桌面应用，手机不可用。但浏览器版（直接打开 index.html）在手机浏览器也能访问。
