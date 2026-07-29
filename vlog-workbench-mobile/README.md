# Vlog Workbench · 手机/平板安装指南

> 在 iPhone、安卓手机、iPad 上安装工作台，三端数据同步

---

## 📋 你需要做的事（按顺序）

### 第 1 步：安装工作台到三台设备

#### iPhone / iPad（用 Safari）

1. 把 `vlog-workbench-mobile` 整个文件夹拷到你的电脑上
2. 在电脑上运行本地服务器（见下方「启动服务器」）
3. iPhone/iPad 打开 **Safari**（⚠️ 必须是 Safari，Chrome 不行）
4. 输入电脑上显示的地址，如 `http://192.168.1.100:8080`
5. 点击 Safari 底部的 **分享按钮 ⬆️**
6. 选择 **「添加到主屏幕」**
7. 点击 **「添加」**
8. 桌面上出现「Vlog Workbench」图标，点击即可全屏使用

> 之后不需要再开 Safari，直接点桌面图标就能用，和原生 App 一样

#### 安卓手机（用 Chrome）

1. 同上，确保手机和电脑连同一个 WiFi
2. Chrome 浏览器打开地址
3. 页面底部会弹出 **「安装」** 提示，点击即可
4. 或点 Chrome 菜单 ⋮ → **「添加到主屏幕」**

### 第 2 步：注册 Supabase（实现三端同步）

1. 在电脑浏览器打开 [supabase.com](https://supabase.com)
2. 点击 **「Start your project」**
3. 用 GitHub 注册（最快）或邮箱注册
4. 点击 **「New Project」**
5. 填写：
   - Name: `vlog-workbench`
   - Password: 自己设一个，**记住它**
   - Region: 选离你近的（如 Northeast Asia / EU West）
6. 等约 2 分钟创建完成
7. 进入项目后，左侧点 **「SQL Editor」**
8. 复制粘贴以下内容，点 **「Run」**：

```sql
CREATE TABLE workbench_data (
  id INT PRIMARY KEY,
  data JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

9. 左侧点 **「Settings」** → **「API」**
10. 找到并复制两个值：
    - **Project URL**（如 `https://abcd.supabase.co`）
    - **anon public key**（一长串 `eyJ...` 开头的字符串）

### 第 3 步：在工作台里配置同步

1. 打开工作台（手机或平板上的图标）
2. 点左侧栏底部的 **「☁️ 云同步」**
3. 把刚才复制的 URL 和 Key 粘贴进去
4. 点 **「保存并连接」**
5. 看到 ✅ 提示就成功了
6. **三台设备都做同样的操作**，填入相同的 URL 和 Key
7. 之后在一台设备上改数据，另外两台打开时会自动同步

---

## 🚀 启动服务器（电脑端操作）

### Windows
```cmd
# 确保 vlog-workbench-mobile 文件夹在电脑上
cd vlog-workbench-mobile
python serve.py
```

### macOS
```bash
cd vlog-workbench-mobile
python3 serve.py
```

运行后会显示一个地址，如 `http://192.168.1.100:8080`，手机打开这个地址即可。

> ⚠️ 电脑必须保持开机和运行服务器状态，手机才能访问。如果需要 24 小时随时访问（不依赖电脑开机），需要部署到云端（见下方「进阶」）。

---

## 📁 文件结构

```
vlog-workbench-mobile/
├── www/
│   ├── index.html          ← 工作台主体
│   ├── manifest.json       ← PWA 配置
│   ├── sw.js               ← 离线缓存
│   └── icons/              ← 应用图标
│       ├── icon-192.png
│       ├── icon-512.png
│       ├── apple-touch-icon.png
│       └── favicon-32.png
├── serve.py                ← 本地服务器脚本
└── README.md               ← 本文件
```

---

## ❓ 常见问题

**Q: 手机打不开地址？**
A: 确保手机和电脑连同一个 WiFi。如果公司/船上的网络隔离了设备间的通信，可能需要用手机热点测试。

**Q: 关掉电脑后手机还能用吗？**
A: 可以。工作台数据存在手机本地（localStorage），断网也能用。只是同步需要电脑服务器在线。如果需要随时同步，建议部署到免费云平台（如 Netlify、Vercel）。

**Q: 数据安全吗？**
A: Supabase 免费版数据存在你的账号下，不对外公开。工作台使用 anon key 只能访问你自己的数据表。

**Q: 以后能上架 App Store 吗？**
A: 可以。这套代码完全兼容 Capacitor 打包，等你有 Mac 电脑后，用 Capacitor 套壳就能提交到 App Store 和 Google Play，前端代码不用改。

---

## 🔧 进阶：部署到云端（24小时随时访问）

如果你不想每次都开电脑，可以把 `www` 文件夹部署到免费云平台：

### 方案 A：Netlify（最简单）
1. 打开 [netlify.com](https://netlify.com)，注册
2. 把 `www` 文件夹拖到 Netlify 部署页面
3. 获得一个网址如 `https://vlog-workbench.netlify.app`
4. 三台设备打开这个网址，添加到主屏幕即可
5. 不再依赖电脑开机

### 方案 B：Vercel
1. 打开 [vercel.com](https://vercel.com)，注册
2. 上传 `www` 文件夹
3. 获得网址，同上使用

---

## 📱 之后上架 App Store 的路径

等你有 Mac 后：
1. 安装 Node.js 和 Xcode
2. `npm install @capacitor/core @capacitor/cli`
3. `npx cap init VlogWorkbench com.yourname.vlogworkbench`
4. `npx cap add ios` / `npx cap add android`
5. 把 `www` 文件夹内容复制到 Capacitor 项目
6. `npx cap open ios` → Xcode 打开 → 配置签名 → Archive → 上传 App Store
7. `npx cap open android` → Android Studio → Build → 上传 Google Play
