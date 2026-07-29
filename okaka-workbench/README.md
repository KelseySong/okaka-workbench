# 哦卡卡的工作台 · 部署指南

## 当前状态

工作台已完整搭建，包含两种模式：
- **离线模式**（当前）：内置智能回复引擎，10个板块均有专属结构化回复，开箱即用
- **AI 对话模式**：配置 API Key 后，所有板块接入完整 AI 对话能力

---

## 本地运行

```bash
cd okaka-workbench
node server.js
```
打开 `http://localhost:3000` 即可使用。

---

## 部署到云端（免费方案）

### 方案一：Render（推荐，最简单）

1. 把 `okaka-workbench` 文件夹上传到 GitHub 仓库
2. 打开 [render.com](https://render.com)，注册
3. New → Web Service → 连接 GitHub 仓库
4. 配置：
   - Build Command: 留空
   - Start Command: `node server.js`
   - 环境变量（可选，配置后启用完整 AI）：
     - `AI_API_URL` = 你的 AI API 端点
     - `AI_API_KEY` = 你的 API 密钥
     - `AI_MODEL` = 模型名（如 gpt-4o-mini）
5. 部署完成后获得网址，手机浏览器直接访问

### 方案二：Vercel

1. 上传到 GitHub
2. 在 Vercel 导入项目
3. 环境变量同上
4. 部署

### 方案三：Railway

1. 上传到 GitHub
2. Railway New Project → 连接仓库
3. 自动识别 Node.js，添加环境变量即可

---

## 启用完整 AI 对话

工作台支持任何 OpenAI 兼容的 API 端点。配置环境变量：

| 变量 | 说明 | 示例 |
|------|------|------|
| `AI_API_URL` | API 端点 | `https://api.openai.com/v1/chat/completions` |
| `AI_API_KEY` | 密钥 | `sk-xxxxx` |
| `AI_MODEL` | 模型 | `gpt-4o-mini` |

**支持的 API 提供商：**
- OpenAI（官方）
- Azure OpenAI
- Moonshot（月之暗面）
- 智谱 AI
- DeepSeek
- 任何 OpenAI 兼容端点

配置后重启服务即可，前端无需改动。

---

## 文件结构

```
okaka-workbench/
├── server.js          ← Node.js 服务端（静态托管 + AI 代理）
├── package.json
├── render.yaml        ← Render 部署配置
├── index.html         ← 工作台源文件
├── public/
│   └── index.html     ← 静态托管副本
└── worker/            ← Cloudflare Worker 备选方案
    ├── ai-proxy.js
    └── wrangler.toml
```

---

## 板块配置

所有板块在 `index.html` 的 `SECTIONS` 数组中集中管理。增减板块只需修改一处：

```javascript
const SECTIONS = [
  { id: 'xxx', icon: '🎬', name: '名称', nameEn: 'English', type: 'chat',
    welcome: '...', desc: '...', suggestions: [...], systemPrompt: '...' },
  // 新增板块在这里添加
];
```

修改后同步到 `public/index.html`，重启服务即可。
