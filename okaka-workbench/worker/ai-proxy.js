/**
 * 哦卡卡工作台 - AI 代理服务
 * 部署到 Cloudflare Worker，保护 API 密钥
 * 前端调用此 Worker，Worker 转发到 AI API
 */

// AI API 配置 - 部署时在 Worker Settings 中设置环境变量
// AI_API_KEY: 你的 AI API 密钥
// AI_API_URL: AI API 端点（如 OpenAI 兼容端点）

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: CORS_HEADERS });
    }

    try {
      const body = await request.json();
      const { messages } = body;

      if (!messages || !Array.isArray(messages)) {
        return new Response(JSON.stringify({ error: 'messages required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
        });
      }

      // Call AI API (OpenAI-compatible format)
      const apiResponse = await fetch(env.AI_API_URL || 'https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.AI_API_KEY}`
        },
        body: JSON.stringify({
          model: body.model || 'gpt-4o-mini',
          messages: messages,
          temperature: body.temperature || 0.7,
          max_tokens: body.max_tokens || 2000
        })
      });

      if (!apiResponse.ok) {
        const errText = await apiResponse.text();
        return new Response(JSON.stringify({ error: `AI API error: ${apiResponse.status}`, detail: errText }), {
          status: apiResponse.status,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
        });
      }

      const data = await apiResponse.json();
      const content = data.choices?.[0]?.message?.content || '无回复内容';

      return new Response(JSON.stringify({ content, raw: data }), {
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    }
  }
};
