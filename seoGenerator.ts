import fetch from 'node-fetch'; // 如果在 Node.js v18 之前的版本或環境中需要

// --- 1. 資料結構定義 ---
interface SEOArticle {
  title: string;
  rawOutline: string; // AI 生成的原始大綱文本
  introduction: string;
  h2Sections: H2Section[];
  cta: string;
  finalHtmlOutput?: string;
}

interface H2Section {
  h2Title: string; // H2 的標題
  contentType: 'narrative' | 'bullet' | 'table'; // 內容類型
  content: string; // AI 生成的該 H2 的內容
}

// --- OpenRouter API 回應的型別定義 ---
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
  // 其他可能的屬性，例如 usage, created 等
}

interface OpenRouterApiErrorDetail {
  message: string;
  code?: string;
  type?: string;
}

interface OpenRouterErrorResponse {
  error: OpenRouterApiErrorDetail;
}


// --- 2. OpenRouter API 互動核心函數 ---
const OPENROUTER_API_KEY = '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'; // <--- 在此處填入您的 OpenRouter API 金鑰
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL_NAME = 'google/gemma-3-27b-it:free';

async function callOpenRouter(prompt: string): Promise<string> {
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        // 'HTTP-Referer': 'YOUR_SITE_URL', // 建議填寫，參考 OpenRouter 文件
        // 'X-Title': 'YOUR_APP_NAME',    // 建議填寫
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [{ role: 'user', content: prompt }],
        // max_tokens: 1024, // 您可以根據需要調整
        // temperature: 0.7, // 您可以根據需要調整
      }),
    });

    if (!response.ok) {
      // 使用明確的型別斷言
      const errorData = await response.json() as OpenRouterErrorResponse; 
      console.error("OpenRouter API Error Response:", errorData);
      throw new Error(`OpenRouter API 錯誤: ${response.status} - ${errorData.error?.message || JSON.stringify(errorData)}`);
    }

    // 使用明確的型別斷言
    const data = await response.json() as OpenRouterCompletionResponse; 
    // 確保 data.choices 存在且不為空，並且 message.content 存在
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

// --- 3. 各部分內容生成函數 ---

// 根據截圖中的提示詞進行調整
async function generateTitle(keywords: string): Promise<string> {
  const prompt = `根據以下關鍵字「${keywords}」，產生一個吸引人的 SEO 標題。標題長度建議在 5 到 15 個字之間，請在標題中發揮創意，可以考慮加入數字、年份或引人注目的詞彙。請只回傳標題本身。`;
  return callOpenRouter(prompt);
}

async function generateOutline(keywords: string): Promise<string> {
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

async function generateIntroduction(keywords: string, articleTitle: string): Promise<string> {
  const prompt = `圍繞主要關鍵字「${keywords}」和文章標題「${articleTitle}」，撰寫一段引人入勝的文章前言。目標是吸引讀者點擊並繼續閱讀。前言長度請控制在 200 字以內。`;
  return callOpenRouter(prompt);
}

async function generateH2Narrative(h2Title: string, keywords: string): Promise<string> {
  const prompt = `針對 H2 標題：「${h2Title}」，並參考主要關鍵字「${keywords}」，請撰寫一段約 200 字的敘述式內文。內容需流暢且資訊豐富。`;
  return callOpenRouter(prompt);
}

async function generateH2BulletPoints(h2Title: string, keywords: string): Promise<string> {
  const prompt = `針對 H2 標題：「${h2Title}」，並參考主要關鍵字「${keywords}」，請產生一段約 200 字的列點式內容。請使用項目符號 (例如 -, *, 或 •) 清晰呈現各個要點。`;
  return callOpenRouter(prompt);
}

async function generateH2Table(h2Title: string, keywords: string): Promise<string> {
  const prompt = `針對 H2 標題：「${h2Title}」，並參考主要關鍵字「${keywords}」，請產生一個包含相關資訊的表格。請使用 Markdown 表格格式輸出。表格應包含表頭和至少兩行數據。`;
  // Gemma 可能不擅長直接輸出複雜的 Markdown 表格，可以引導它先思考欄位和內容
  // 例如: "請先思考表格需要哪些欄位，然後用 Markdown 格式呈現包含這些欄位和範例數據的表格。"
  return callOpenRouter(prompt);
}

async function generateCTA(brandProductKeywords: string): Promise<string> {
  const prompt = `根據品牌/產品關鍵字「${brandProductKeywords}」，撰寫一段約 200 字以內的行動呼籲 (CTA) 文案。目標是引導讀者點擊連結、加入 LINE 或採取其他您希望的特定行動。請讓 CTA 明確且具說服力。`;
  return callOpenRouter(prompt);
}

// --- 4. Markdown 表格轉 HTML (簡化版) ---
function isMarkdownTable(content: string): boolean {
    const lines = content.trim().split('\n');
    // 至少要有標頭、分隔線、一行內容才算基本表格
    return lines.length >= 3 && lines[1].includes('|') && lines[1].includes('-');
}

function convertMarkdownTableToHtml(markdown: string): string {
    const lines = markdown.trim().split('\n');
    let html = '<table>\n';

    // 處理表頭
    const headerLine = lines[0];
    const headers = headerLine.split('|').map(s => s.trim()).filter(s => s); // 過濾空字串
    if (headers.length > 0) {
        html += '  <thead>\n    <tr>\n';
        headers.forEach(header => html += `      <th>${header}</th>\n`);
        html += '    </tr>\n  </thead>\n';
    }

    // 處理表格內容 (跳過分隔線 lines[1])
    html += '  <tbody>\n';
    for (let i = 2; i < lines.length; i++) {
        const cells = lines[i].split('|').map(s => s.trim()).filter(s => s);
        if (cells.length > 0 && cells.length === headers.length) { // 確保儲存格數量與表頭一致
            html += '    <tr>\n';
            cells.forEach(cell => html += `      <td>${cell}</td>\n`);
            html += '    </tr>\n';
        } else if (cells.length > 0) { // 如果數量不一致，還是嘗試渲染，但可能會有問題
             html += '    <tr>\n';
             cells.forEach(cell => html += `      <td>${cell}</td>\n`);
             // 補齊不足的 td
             for(let k=0; k < headers.length - cells.length; k++){
                 html += `      <td></td>\n`;
             }
             html += '    </tr>\n';
        }
    }
    html += '  </tbody>\n';
    html += '</table>\n';
    return html;
}


// --- 5. 合併與格式化為最終 HTML ---
function formatArticleToHtml(article: SEOArticle): string {
  let output = "";

  // 標題 (H1)
  if (article.title) {
    output += `<h1>${article.title.replace(/\n/g, '<br>')}</h1>\n\n`;
  }

  // 前言
  if (article.introduction) {
    // 將多個換行符轉為段落，單個換行符轉為 <br>
    const introParagraphs = article.introduction.split(/\n\s*\n/).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('\n');
    output += `${introParagraphs}\n\n`;
  }

  // H2 各段落
  article.h2Sections.forEach(section => {
    output += `<h2>${section.h2Title.replace(/\n/g, '<br>')}</h2>\n`;
    let sectionContentHtml = "";
    switch (section.contentType) {
      case 'narrative':
        // 將多個換行符轉為段落，單個換行符轉為 <br>
        sectionContentHtml = section.content.split(/\n\s*\n/).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('\n');
        break;
      case 'bullet':
        const items = section.content.split('\n').map(item => item.trim().replace(/^[\*\-\•]\s*/, '')).filter(item => item);
        if (items.length > 0) {
          sectionContentHtml = "<ul>\n";
          items.forEach(item => {
            sectionContentHtml += `  <li>${item}</li>\n`;
          });
          sectionContentHtml += "</ul>";
        } else {
          sectionContentHtml = `<p>${section.content.replace(/\n/g, '<br>')}</p>`; // 降級處理
        }
        break;
      case 'table':
        if (isMarkdownTable(section.content)) {
            sectionContentHtml = convertMarkdownTableToHtml(section.content);
        } else {
            // 如果不是標準 Markdown 表格，或者模型直接返回了類似 HTML 的結構 (儘管不建議)
            // 則直接輸出，或用 <p> 包裹
            console.warn(`H2 "${section.h2Title}" 的表格內容可能不是標準 Markdown 格式，將直接輸出。內容:`, section.content);
            sectionContentHtml = `<div>${section.content}</div>`; // 使用 div 包裹以防意外
        }
        break;
    }
    output += `${sectionContentHtml}\n\n`;
  });

  // CTA
  if (article.cta) {
    output += `<h3>CTA</h3>\n`; // CTA 通常作為一個小節標題
    const ctaParagraphs = article.cta.split(/\n\s*\n/).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('\n');
    output += `${ctaParagraphs}\n`;
  }

  return output.trim();
}


// --- 6. 主應用程式邏輯 (範例) ---
class SEOContentGenerator {
  public article: SEOArticle;

  constructor() {
    this.article = {
      title: "",
      rawOutline: "",
      introduction: "",
      h2Sections: [],
      cta: "",
    };
  }

  async setTitle(keywords: string): Promise<void> {
    console.log(`正在生成標題 (關鍵字: ${keywords})...`);
    this.article.title = await generateTitle(keywords);
    console.log("標題已生成:", this.article.title);
  }

  async setOutline(keywords: string): Promise<void> {
    console.log(`正在生成大綱 (關鍵字: ${keywords})...`);
    this.article.rawOutline = await generateOutline(keywords);
    console.log("大綱已生成:\n", this.article.rawOutline);
    // 您可以在此處添加解析 rawOutline 以提取 H2 標題供後續步驟使用的邏輯
  }

  async setIntroduction(keywords: string): Promise<void> {
    if (!this.article.title) {
      console.warn("請先生成標題，前言生成需要標題資訊。");
      return;
    }
    console.log(`正在生成前言 (關鍵字: ${keywords}, 標題: ${this.article.title})...`);
    this.article.introduction = await generateIntroduction(keywords, this.article.title);
    console.log("前言已生成:", this.article.introduction);
  }

  async addH2Section(h2TitleFromUser: string, type: 'narrative' | 'bullet' | 'table', keywords: string): Promise<void> {
    console.log(`正在為 H2 "${h2TitleFromUser}" 生成 ${type} 內容 (關鍵字: ${keywords})...`);
    let content = "";
    switch (type) {
      case 'narrative':
        content = await generateH2Narrative(h2TitleFromUser, keywords);
        break;
      case 'bullet':
        content = await generateH2BulletPoints(h2TitleFromUser, keywords);
        break;
      case 'table':
        content = await generateH2Table(h2TitleFromUser, keywords);
        break;
    }
    this.article.h2Sections.push({ h2Title: h2TitleFromUser, contentType: type, content });
    console.log(`H2 "${h2TitleFromUser}" (${type}) 內容已生成。`);
  }

  async setCTA(brandProductKeywords: string): Promise<void> {
    console.log(`正在生成 CTA (品牌/產品關鍵字: ${brandProductKeywords})...`);
    this.article.cta = await generateCTA(brandProductKeywords);
    console.log("CTA 已生成:", this.article.cta);
  }

  generateFinalHtml(): string {
    console.log("正在合併所有內容並格式化為 HTML...");
    this.article.finalHtmlOutput = formatArticleToHtml(this.article);
    console.log("最終 HTML 已生成。");
    return this.article.finalHtmlOutput;
  }

  getArticle(): SEOArticle {
    return this.article;
  }
}

// --- 7. 如何使用 (範例執行流程) ---
async function runSEOToolDemo() {
  // 這裡的檢查已經移到 callOpenRouter 函數內部，更集中管理
  // if (OPENROUTER_API_KEY === 'YOUR_OPENROUTER_API_KEY') {
  //   console.error("請先在程式碼中設定您的 OpenRouter API 金鑰。");
  //   return;
  // }

  const generator = new SEOContentGenerator();
  const mainKeywords = "TypeScript 高效能程式設計"; // 主要關鍵字

  try {
    // 1. 生成標題
    await generator.setTitle(mainKeywords);

    // 2. 生成大綱 (用戶可以參考這個大綱來決定 H2 標題)
    await generator.setOutline(mainKeywords);
    // 假設從大綱中提取或用戶決定了 H2 標題：
    // (實際應用中，UI 會讓用戶從大綱選擇或手動輸入 H2 標題)
    const h2Title1FromOutline = "TypeScript 的靜態類型優勢"; // 假設這是從大綱分析出來的
    const h2Title2FromOutline = "提升 TypeScript 應用效能的技巧";
    const h2Title3ForTable = "常用 TypeScript 效能工具比較";


    // 3. 生成前言
    await generator.setIntroduction(mainKeywords);

    // 4. 為 H2 生成內容 (用戶可以為大綱中的每個 H2 或自訂 H2 選擇類型並生成)
    await generator.addH2Section(h2Title1FromOutline, 'narrative', mainKeywords);
    await generator.addH2Section(h2Title2FromOutline, 'bullet', mainKeywords);
    await generator.addH2Section(h2Title3ForTable, 'table', mainKeywords); // 表格類型

    // 5. 生成 CTA
    await generator.setCTA("我的 TypeScript 線上課程");

    // 6. 合併所有內容並輸出 HTML
    const finalHtml = generator.generateFinalHtml();
    console.log("\n--- 最終產生的 HTML (可直接貼至 Google Docs / WordPress HTML 編輯器) ---");
    console.log(finalHtml);

  } catch (error) {
    console.error("SEO 工具演示過程中發生錯誤:", error);
  }
}

// 執行範例 (在 Node.js 環境中)
runSEOToolDemo();
