# 哦卡卡的工作台 · 部署到 Render 完整指南

## 你的情况

- 没有 GitHub 账号
- 想要一个链接，手机打开就能用
- 想安装到手机桌面

## 最快方案：注册 GitHub → 推送 → 连接 Render

总共需要约 15 分钟，分为 3 步。

---

## 第 1 步：注册 GitHub（5分钟）

1. 手机浏览器打开 [github.com](https://github.com)
2. 点 **「Sign up」**
3. 输入邮箱、密码、用户名
4. 验证邮箱
5. 完成

> GitHub 是全球最大的代码托管平台，免费，以后部署任何应用都会用到它。

---

## 第 2 步：告诉我你的 GitHub 用户名

注册完成后，把你的 **GitHub 用户名** 告诉我。

我会帮你：
- 在你的 GitHub 创建仓库 `okaka-workbench`
- 把所有代码推上去
- 给你仓库链接

---

## 第 3 步：连接 Render 部署（5分钟）

1. 打开 [render.com](https://render.com)，点 **「Get Started」**，用 GitHub 注册
2. 点 **「New +」** → **「Blueprint」**
3. 选择你的 `okaka-workbench` 仓库
4. Render 自动识别 `render.yaml` 配置
5. 点 **「Apply」**
6. 等待 1-2 分钟构建完成
7. 获得链接：`https://okaka-workbench.onrender.com`

**这个链接就是你的 App 地址！**

---

## 第 4 步：安装到手机桌面

### iPhone
1. **Safari** 打开 `https://okaka-workbench.onrender.com`
2. 点底部 **分享按钮 ⬆️**
3. 选 **「添加到主屏幕」** → **「添加」**
4. 桌面出现 🎀 图标 ✅

### 安卓
1. **Chrome** 打开链接
2. 弹出 **「安装」** 提示 → 点安装
3. 桌面出现图标 ✅

---

## 可选：启用完整 AI 对话

部署到 Render 后，在 Render 后台添加环境变量：

1. 进入 Render Dashboard → 你的服务 → **Environment**
2. 添加三个变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `AI_API_URL` | `https://api.deepseek.com/v1/chat/completions` | API端点 |
| `AI_API_KEY` | `sk-xxxxx` | 你的API密钥 |
| `AI_MODEL` | `deepseek-chat` | 模型名 |

3. 保存 → 自动重新部署
4. 所有 10 个板块获得完整 AI 对话能力

**推荐使用 DeepSeek**（最便宜，国内可用）：
- 注册 [platform.deepseek.com](https://platform.deepseek.com)
- 充 1 块钱够用很久
- API URL: `https://api.deepseek.com/v1/chat/completions`
- Model: `deepseek-chat`

---

## 两种模式对比

| 模式 | 需要API Key | 功能 | 费用 |
|------|------------|------|------|
| 离线模式 | 不需要 | 10板块内置结构化回复 | 免费 |
| AI模式 | 需要 | 完整AI对话，个性化回复 | API按量计费 |

不配 API Key 也能用，每个板块都有实用的离线回复内容。

---

## 当前文件

ZIP 包已准备好：`okaka-workbench.zip`（41KB）

包含：
- `server.js` — Node.js 后端（静态托管 + AI 代理 + 离线回复引擎）
- `public/index.html` — 完整前端（10板块 + PWA安装 + AI设置页）
- `public/manifest.json` — PWA 配置
- `public/sw.js` — 离线缓存
- `public/icons/` — App 图标
- `package.json` — 依赖配置
- `render.yaml` — Render 部署配置
