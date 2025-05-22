// lib/seoGenerator.ts - 提供給 API 路由使用的 SEO 生成函數

import fetch from 'node-fetch';

// OpenRouter API 配置
const OPENROUTER_API_KEY = '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';
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
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

// OpenRouter API 調用核心函數
async function callOpenRouter(prompt: string): Promise<string> {
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json() as OpenRouterErrorResponse;
      console.error("OpenRouter API Error Response:", errorData);
      throw new Error(`OpenRouter API 錯誤: ${response.status} - ${errorData.error?.message || JSON.stringify(errorData)}`);
    }

    const data = await response.json() as OpenRouterCompletionResponse;
    if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
      return data.choices[0].message.content.trim();
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
  const prompt = `根據以下關鍵字「${keywords}」，產生一個吸引人的 SEO 標題。標題長度建議在 5 到 15 個字之間，請在標題中發揮創意，可以考慮加入數字、年份或引人注目的詞彙。請只回傳標題本身。`;
  return callOpenRouter(prompt);
}

export async function generateOutline(keywords: string): Promise<string> {
  const prompt = `針對主要關鍵字「${keywords}」，請產生一份詳細的 SEO 文章大綱。大綱應包含一個 H1 標題，以及多個 H2 標題。每個 H2 標題下方可以有數個 H3 標題作為子項目。請用以下格式清晰地列出大綱：
H1: [您的 H1 標題]
H2: [您的 H2 標題 1]
H3: [H3 子標題 A]
H3: [H3 子標題 B]
H2: [您的 H2 標題 2]
H3: [H3 子標題 C]
H3: [H3 子標題 D]
以此類推。`;
  return callOpenRouter(prompt);
}

export async function generateIntroduction(keywords: string, articleTitle: string): Promise<string> {
  const prompt = `圍繞主要關鍵字「${keywords}」和文章標題「${articleTitle}」，撰寫一段引人入勝的文章前言。目標是吸引讀者點擊並繼續閱讀。前言長度請控制在 200 字以內。`;
  return callOpenRouter(prompt);
}

export async function generateH2Content(h2Title: string, keywords: string, type: string): Promise<string> {
  let prompt = '';
  
  switch (type) {
    case 'narrative':
      prompt = `針對 H2 標題：「${h2Title}」，並參考主要關鍵字「${keywords}」，請撰寫一段約 200 字的敘述式內文。內容需流暢且資訊豐富。`;
      break;
    case 'bullet':
      prompt = `針對 H2 標題：「${h2Title}」，並參考主要關鍵字「${keywords}」，請產生一段約 200 字的列點式內容。請使用項目符號 (例如 -, *, 或 •) 清晰呈現各個要點。`;
      break;
    case 'table':
      prompt = `針對 H2 標題：「${h2Title}」，並參考主要關鍵字「${keywords}」，請產生一個包含相關資訊的表格。請使用 Markdown 表格格式輸出。表格應包含表頭和至少兩行數據。`;
      break;
    default:
      throw new Error(`不支援的內容類型: ${type}`);
  }
  
  return callOpenRouter(prompt);
}

export async function generateCTA(brandProductKeywords: string): Promise<string> {
  const prompt = `根據品牌/產品關鍵字「${brandProductKeywords}」，撰寫一段約 200 字以內的行動呼籲 (CTA) 文案。目標是引導讀者點擊連結、加入 LINE 或採取其他您希望的特定行動。請讓 CTA 明確且具說服力。`;
  return callOpenRouter(prompt);
}