// lib/seoGenerator.ts - 正確的 OpenRouter 配置

// 移除這行，因為現代 Node.js 已經內建 fetch
// import fetch from 'node-fetch';

// OpenRouter API 配置 - 只使用環境變數（安全實踐）
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const MODEL_NAME = 'google/gemma-3-27b-it:free';

// OpenRouter API 回應的型別定義
interface OpenRouterMessage {
  role: string;
  content: string;
}

interface OpenRouterChoice {
  message: OpenRouterMessage;
  finish_reason: string;
  index: number;
}

interface OpenRouterCompletionResponse {
  id: string;
  model: string;
  choices: OpenRouterChoice[];
}

interface OpenRouterApiErrorDetail {
  message: string;
  code?: string;
  type?: string;
}

interface OpenRouterErrorResponse {
  error: OpenRouterApiErrorDetail;
}

// OpenRouter API 調用核心函數 - 使用正確的 baseURL 配置
async function callOpenRouter(prompt: string): Promise<string> {
  // 檢查 API 金鑰是否設置
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'YOUR_API_KEY_HERE') {
    throw new Error('請設置有效的 OPENROUTER_API_KEY。請前往 https://openrouter.ai/ 獲取 API 金鑰');
  }

  console.log(`🔍 使用模型: ${MODEL_NAME}`);
  console.log(`🌐 API 基礎 URL: ${OPENROUTER_BASE_URL}`);
  console.log(`📝 提示詞長度: ${prompt.length} 字符`);

  try {
    // 使用正確的 OpenRouter API 配置 - baseURL + endpoint
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://localhost:3000', // 替換為你的域名
        'X-Title': 'SEO Content Generator',
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [{ 
          role: 'user', 
          content: prompt 
        }],
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json() as OpenRouterErrorResponse;
      console.error("OpenRouter API Error Response:", errorData);
      
      // 提供更具體的錯誤訊息
      if (response.status === 401) {
        throw new Error(`❌ API 金鑰無效或已過期。請前往 https://openrouter.ai/ 獲取新的 API 金鑰。錯誤: ${errorData.error?.message}`);
      } else if (response.status === 429) {
        throw new Error(`⏰ API 使用頻率限制。請稍後再試。錯誤: ${errorData.error?.message}`);
      } else if (response.status === 402) {
        throw new Error(`💳 API 額度不足。請檢查你的 OpenRouter 帳戶餘額。錯誤: ${errorData.error?.message}`);
      } else {
        throw new Error(`🚨 OpenRouter API 錯誤 (${response.status}): ${errorData.error?.message || JSON.stringify(errorData)}`);
      }
    }

    const data = await response.json() as OpenRouterCompletionResponse;
    console.log(`✅ API 調用成功，模型: ${data.model}`);
    
    if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
      const result = data.choices[0].message.content.trim();
      console.log(`📄 生成內容長度: ${result.length} 字符`);
      return result;
    } else {
      throw new Error("OpenRouter API 回應格式不符預期或內容為空。");
    }
  } catch (error) {
    console.error("調用 OpenRouter 時發生錯誤:", error);
    throw error;
  }
}

// === 導出的生成函數 ===

export async function generateTitle(keywords: string): Promise<string> {
  const prompt = `針對關鍵字 ${keywords}，根據關鍵字搜尋意圖，產生 SEO 標題。

請只回傳標題本身，不要額外說明。`;
  return callOpenRouter(prompt);
}

export async function generateOutline(keywords: string, title?: string): Promise<string> {
  const titlePart = title ? `根據標題：${title}，關鍵字：${keywords}` : `關鍵字：${keywords}`;
  const prompt = `${titlePart}，產生一個 SEO 文章大綱。

請直接提供大綱內容。`;
  return callOpenRouter(prompt);
}

export async function generateIntroduction(keywords: string, articleTitle: string): Promise<string> {
  const prompt = `依據關鍵字：${keywords}，生出一段文字前言，字數在 200 字以內。

請直接提供前言內容。`;
  return callOpenRouter(prompt);
}

export async function generateH2Content(h2Title: string, keywords: string, type: string): Promise<string> {
  let prompt = '';
  
  switch (type) {
    case 'narrative':
      prompt = `依據提供的 H2（${h2Title}）產生一段內容，約 250 字。`;
      break;
      
    case 'bullet':
      prompt = `依據提供的 H2、H3（${h2Title}）產生文案，約 250 字。`;
      break;
      
    case 'table':
      prompt = `依據提供的 H2、H3（${h2Title}）產生表格（markdown 語法）。`;
      break;
      
    default:
      throw new Error(`不支援的內容類型: ${type}`);
  }
  
  return callOpenRouter(prompt);
}

export async function generateCTA(brandProductKeywords: string): Promise<string> {
  const prompt = `依據提供的品牌名稱 ${brandProductKeywords}，整理出一段特色介紹 ${brandProductKeywords}，並生成一個 CTA，約 200 字，請閱讀者前往（商品頁連結、LINE 諮詢）。

請直接提供 CTA 文案。`;
  return callOpenRouter(prompt);
}