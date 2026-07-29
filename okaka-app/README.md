# 哦卡卡的工作台 · 安装部署指南

## 🎯 你的目标

> 一个链接 → 手机点开 → 下载安装 → 桌面出现 App 图标

---

## 📁 你拿到的文件

```
okaka-app/
├── www/                ← App 主体（纯前端，不需要后端）
│   ├── index.html      ← 工作台完整应用（56KB）
│   ├── manifest.json   ← PWA 安装配置
│   ├── sw.js           ← 离线缓存
│   └── icons/          ← App 图标
├── download/
│   └── index.html      ← 下载安装引导页
└── icons/              ← 图标源文件
```

---

## 🚀 获得可访问链接（3种方式，任选一种）

### 方式一：Netlify 拖拽部署（最简单，5分钟）

1. 打开 [app.netlify.com/drop](https://app.netlify.com/drop)（不用注册）
2. 把 `www` 文件夹拖到页面上
3. 等待 10 秒，自动获得链接，如 `https://okaka-xxx.netlify.app`
4. **这就是你的链接**，手机浏览器打开即可安装

> 💡 如果想自定义链接名，注册 Netlify（免费）后可修改

### 方式二：GitHub Pages（永久免费）

1. 注册 [github.com](https://github.com)
2. 新建仓库 → 上传 `www` 文件夹里所有文件
3. Settings → Pages → Source 选 `main` 分支 → Save
4. 等待 1 分钟，获得链接 `https://你的用户名.github.io/仓库名/`

### 方式三：Vercel 部署

1. 打开 [vercel.com](https://vercel.com)，注册
2. New Project → 上传 `www` 文件夹
3. 部署完成获得链接

---

## 📱 手机安装步骤

### iPhone / iPad（用 Safari）

1. Safari 打开你的链接
2. 点底部 **分享按钮 ⬆️**
3. 选 **「添加到主屏幕」**
4. 点 **「添加」**
5. 桌面出现 🎀 图标 → 完成安装

> ⚠️ 必须用 Safari，Chrome 不支持添加到主屏幕

### Android（用 Chrome）

1. Chrome 打开你的链接
2. 页面会弹出 **「安装」** 提示 → 点安装
3. 或点 Chrome 菜单 ⋮ → **「添加到主屏幕」**
4. 桌面出现图标 → 完成安装

---

## 🔑 启用完整 AI 对话（可选）

App 默认使用**离线模式**，每个板块已有内置回复。如需完整 AI 对话：

1. 打开 App → 左下角点 **「⚙️ AI设置」**
2. 选择预设（OpenAI / DeepSeek / 智谱 / 月之暗面）
3. 填入你的 **API Key**
4. 保存 → 自动切换为 AI 在线模式

**获取 API Key：**
- OpenAI：[platform.openai.com](https://platform.openai.com)
- DeepSeek：[platform.deepseek.com](https://platform.deepseek.com)（便宜，推荐）
- 智谱 AI：[open.bigmodel.cn](https://open.bigmodel.cn)
- 月之暗面：[platform.moonshot.cn](https://platform.moonshot.cn)

> 密钥仅存在手机本地，不经过任何第三方服务器。

---

## ✅ 功能清单

| 板块 | 离线模式 | AI模式 |
|------|---------|--------|
| 🎬 视频创作 | ✅ 内置选题+剪辑建议 | ✅ 个性化脚本文案 |
| 🇪🇸 西语学习 | ✅ 音标+谐音+场景对话 | ✅ 完整对话练习 |
| 🌸 美妆信息 | ✅ 香水科普+前中后调 | ✅ 详细品牌解析 |
| 🍳 美食配方 | ✅ 3个食谱参考 | ✅ 个性化食谱 |
| 📝 工作事务 | ✅ 完整待办清单 | — 独立功能 |
| 💪 健身 | ✅ 训练计划+动作要点 | ✅ 个性化计划 |
| 🇬🇧 英文学习 | ✅ 音标例句 | ✅ 完整练习 |
| 🇷🇺 俄语学习 | ✅ 音标+谐音 | ✅ 完整对话 |
| ✍️ 文案生成 | ✅ 文案素材 | ✅ 个性化生成 |
| 📈 股票资讯 | ✅ 市场要点 | ✅ 实时资讯 |

---

## ❓ 常见问题

**Q: 安装后没网能用吗？**
A: 能。离线模式完全可用，所有数据存在手机本地。AI 模式需要联网。

**Q: 三台设备数据同步吗？**
A: 不同步。每台设备独立存储。如需同步，在 AI 设置里填入 API Key 后对话通过 API 进行，但历史记录仍存本地。

**Q: App 会过期吗？**
A: 不会。部署后的链接永久有效（Netlify/GitHub Pages 免费永久）。

**Q: 能上架 App Store 吗？**
A: 这套 PWA 代码完全兼容 Capacitor 打包。等你有 Mac 后，用 Capacitor 套壳即可提交 App Store，前端代码不用改。
