/**
 * 哦卡卡的工作台 - 服务端
 * 提供静态文件托管 + AI 代理
 * 部署到 Render / Railway / Vercel 等
 *
 * 配置环境变量:
 *   AI_API_URL  - AI API 端点（OpenAI 兼容格式）
 *   AI_API_KEY  - API 密钥
 *   AI_MODEL    - 模型名称（默认 gpt-4o-mini）
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const AI_API_URL = process.env.AI_API_URL || '';
const AI_API_KEY = process.env.AI_API_KEY || '';
const AI_MODEL = process.env.AI_MODEL || 'gpt-4o-mini';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // AI proxy endpoint
  if (req.url === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const messages = data.messages || [];

        // If no API key configured, return offline fallback
        if (!AI_API_URL || !AI_API_KEY) {
          const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
          const userText = lastUserMsg ? lastUserMsg.content : '';
          const systemMsg = messages.find(m => m.role === 'system');
          const sectionId = extractSectionId(systemMsg?.content || '');

          const reply = generateOfflineReply(sectionId, userText);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ content: reply, offline: true }));
          return;
        }

        // Call AI API
        const apiRes = await fetch(AI_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AI_API_KEY}`
          },
          body: JSON.stringify({
            model: AI_MODEL,
            messages: messages,
            temperature: data.temperature || 0.7,
            max_tokens: data.max_tokens || 2000
          })
        });

        if (!apiRes.ok) {
          const errText = await apiRes.text().catch(() => '');
          console.error('AI API error:', apiRes.status, errText);
          // Return error info instead of silent offline fallback
          const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
          const userText = lastUserMsg ? lastUserMsg.content : '';
          const systemMsg = messages.find(m => m.role === 'system');
          const sectionId = extractSectionId(systemMsg?.content || '');
          const offlineReply = generateOfflineReply(sectionId, userText);
          // Append error diagnostic info
          const errorMsg = `\n\n⚠️ **AI API 调试信息**\n- 状态码: ${apiRes.status}\n- 错误: ${errText.substring(0, 300)}\n- API URL: ${AI_API_URL}\n- Model: ${AI_MODEL}\n- Key前缀: ${AI_API_KEY.substring(0, 8)}...`;
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ content: offlineReply + errorMsg, offline: true, apiError: true, errorStatus: apiRes.status, errorDetail: errText.substring(0, 500) }));
          return;
        }

        const aiData = await apiRes.json();
        const content = aiData.choices?.[0]?.message?.content || '无回复内容，请重试。';

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ content }));
      } catch (err) {
        console.error('Server error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Health check
  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      aiConfigured: !!(AI_API_URL && AI_API_KEY),
      model: AI_MODEL
    }));
    return;
  }

  // Static file serving
  let filePath = req.url === '/' ? '/index.html' : req.url;
  // Remove query string
  filePath = filePath.split('?')[0];
  filePath = path.join(__dirname, 'public', filePath);

  // Security: prevent path traversal
  const publicDir = path.join(__dirname, 'public');
  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Fallback to index.html for SPA
      const fallback = path.join(__dirname, 'public', 'index.html');
      fs.readFile(fallback, (e2, d2) => {
        if (e2) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(d2);
        }
      });
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

// Extract section identifier from system prompt
function extractSectionId(systemPrompt) {
  const map = {
    '视频创作': 'video',
    '西班牙语': 'spanish',
    '香水': 'beauty',
    '美食配方': 'food',
    '健身': 'fitness',
    '英文学习': 'english',
    '俄语': 'russian',
    '文案': 'copywriting',
    '股票': 'stocks',
    '热点二创': 'trending'
  };
  for (const [key, id] of Object.entries(map)) {
    if (systemPrompt.includes(key)) return id;
  }
  return 'general';
}

// Offline reply generator - provides useful structured responses per section
function generateOfflineReply(sectionId, userText) {
  const replies = {
    video: `🎬 **视频创作助手**（离线模式）

我注意到你问了关于「${userText}」的问题。当前处于离线模式，以下是通用建议：

**热门短视频选题方向：**
1. 港口/旅行第一视角漫步
2. 美食探店+价格换算
3. 船上生活日常 vlog
4. 剪映教程/卡点教学
5. 反差对比类（船上 vs 岸上）

**剪辑技巧：**
- 前3秒必须抓人（疑问/反差/美景）
- 节奏感：快剪+卡点BGM
- 字幕用大号粗体，中英双语

> 💡 连接 AI API 后可获得个性化脚本和文案。配置方法见 README。`,

    spanish: `🇪🇸 **西语学习**（离线模式）

关于「${userText}」，以下是一些实用表达：

**购物场景常用短句：**
- ¿Cuánto cuesta?
  音标：[ˈkwan.to ˈkwes.ta]
  谐音：宽托 奎斯塔
  意思：多少钱？

- ¿Tiene...?
  音标：[ˈtje.ne]
  谐音：蒂耶内
  意思：有...吗？

- Más barato, por favor
  音标：[mas βaˈɾa.to poɾ faˈβoɾ]
  谐音：马斯 巴拉托 波尔 法沃尔
  意思：便宜点，拜托

> 💡 连接 AI API 后可获取完整场景对话练习。`,

    beauty: `🌸 **香水科普**（离线模式）

关于「${userText}」，以下是基础知识：

**香水前中后调解析：**
- **前调（Top）**：喷后15分钟内，通常是柑橘、花草等轻盈香调
- **中调（Heart）**：15分钟-1小时，主体香气，多为花卉、果香
- **后调（Base）**：1小时后，留香最久，常见木质、麝香、琥珀

**香奈儿经典香水：**
1. **N°5** — 醛香花香调，经典女性香水
2. **Bleu de Chanel** — 木质芳香调，男士经典
3. **Coco Mademoiselle** — 东方花香调，年轻女性

> 💡 连接 AI API 后可获取详细品牌对比和香调解析。`,

    food: `🍳 **美食配方**（离线模式）

关于「${userText}」，这里有一个简单食谱参考：

**番茄炒蛋（家常快手菜）**
食材：鸡蛋3个、番茄2个
调料：盐3g、糖5g、食用油15ml

步骤：
1. 鸡蛋打散加1g盐搅匀，番茄切块
2. 热锅冷油，倒入蛋液炒至凝固盛出
3. 锅中加少许油，放番茄翻炒出汁
4. 加糖5g、盐2g调味
5. 倒入鸡蛋翻匀，出锅

⏱️ 时间：10分钟 | 难度：★☆☆

> 💡 连接 AI API 后可获取个性化食谱推荐。`,

    fitness: `💪 **健身助手**（离线模式）

关于「${userText}」，以下是居家训练建议：

**居家无器械全身计划：**
1. **深蹲** 3×15次 — 臀腿
   要点：膝盖不超脚尖，背部挺直
2. **俯卧撑** 3×12次 — 胸手臂
   要点：身体成直线，下降到肘90°
3. **平板支撑** 3×30秒 — 核心
   要点：收腹，臀部不塌不翘
4. **弓步蹲** 3×10次/腿 — 臀腿
   要点：前膝不超脚尖，后膝接近地面
5. **臀桥** 3×15次 — 臀部
   要点：顶峰收紧臀部，停1秒

⏱️ 总时长约20分钟 | 每周3-4次

> 💡 连接 AI API 后可生成个性化每日训练计划。`,

    english: `🇬🇧 **English Learning**（离线模式）

About "${userText}", here are some useful expressions:

**Workplace Communication:**
- I'd like to schedule a follow-up meeting.
  音标：[aɪd laɪk tuˈskɛdʒuːl əˈfɒloʊˌʌpˈmitɪŋ]
  中文：我想安排一个后续会议。

- Could you send me the summary by Friday?
  音标：[kʊd juː sɛnd miː ðəˈsʌməri baɪˈfraɪdeɪ]
  中文：能在周五前发我总结吗？

- Let's circle back to this later.
  音标：[lɛtsˈsɜːkəl bæk tuː ðɪsˈleɪtə]
  中文：我们稍后再讨论这个。

> 💡 Connect AI API for full practice exercises.`,

    russian: `🇷🇺 **俄语学习**（离线模式）

关于「${userText}」，以下是一些入门表达：

**日常问候：**
- Привет!
  音标：[prʲɪˈvʲet]
  谐音：普利维特
  意思：你好！（非正式）

- Здравствуйте!
  音标：[zdrɑstˈvuj.tʲe]
  谐音：兹德拉斯特维耶
  意思：您好！（正式）

- Спасибо
  音标：[spɐˈsʲi.bə]
  谐音：斯巴西巴
  意思：谢谢

**数字 1-5：**
1 - один (阿金) 2 - два (德瓦) 3 - три (特里) 4 - четыре (切蒂列) 5 - пять (尼亚季)

> 💡 连接 AI API 后可获取完整场景对话练习。`,

    copywriting: `✍️ **文案生成**（离线模式）

关于「${userText}」，以下是一些文案素材：

**朋友圈唯美文案：**
1. 生活不在别处，在此刻的每一帧里。
2. 所有的远行，都是为了更好的归来。
3. 把日子过成诗，不需要押韵。

**短视频引导关注文案：**
1. 「如果你也在路上，点个关注，我们一起走」
2. 「更多港口故事，关注我不迷路」
3. 「下期更精彩，别忘了关注哦」

**小红书种草模板：**
📍 地点 + ✨ 亮点 + 💰 价格 + 📌 攻略
「终于来了！[地点]真的太好拍了，[亮点]，只要[价格]，攻略放在最后啦～」

> 💡 连接 AI API 后可生成个性化文案。`,

    stocks: `📈 **股票资讯**（离线模式）

关于「${userText}」：

**近期市场关注要点：**
1. 美联储利率决议及货币政策走向
2. 科技巨头财报季表现
3. AI产业链相关公司动态
4. 国际地缘政治对市场影响

⚠️ **重要声明**：以上仅为信息整理，不构成任何投资建议。投资有风险，决策需谨慎。

> 💡 连接 AI API 后可获取实时资讯整理。`,

    trending: `🔥 **热点二创**（离线模式）

我注意到你问了关于「${userText}」的问题。当前处于离线模式，以下是通用二创思路：

**常青热点类型（适合随时二创）：**
1. 反差对比类 — 船上 vs 岸上、预期 vs 现实
2. 第一视角漫步 — 港口街头沉浸式
3. 价格换算类 — 当地物价折算成人民币
4. 文化碰撞类 — 语言误会/习俗差异
5. 职业揭秘类 — 海员的一天

**二创选题方案：**
1. 「船员眼中的XX港」— 用你的视角拍当地地标
2. 「XX港物价大揭秘」— 探店+价格换算
3. 「海上 vs 陆上」— 对比剪辑，BGM卡点

> 💡 连接 AI API 后可获取实时热点追踪和个性化二创方案。`,

    general: `收到你的消息：「${userText}」

当前工作台处于离线模式，AI 对话功能需要配置 API 密钥后才能使用完整功能。

请在左侧选择具体板块使用对应功能，或参考 README 配置 AI API。`
  };

  return replies[sectionId] || replies.general;
}

server.listen(PORT, () => {
  console.log(`🎀 哦卡卡的工作台运行在 http://localhost:${PORT}`);
  console.log(`   AI API: ${AI_API_URL ? '已配置' : '未配置（离线模式）'}`);
});
