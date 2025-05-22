import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

interface H2Section {
  h2Title: string;
  type: string;
  content: string;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [keywords, setKeywords] = useState('');
  const [title, setTitle] = useState('');
  const [outline, setOutline] = useState('');
  const [intro, setIntro] = useState('');
  const [h2Sections, setH2Sections] = useState<H2Section[]>([]);
  const [cta, setCta] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentOperation, setCurrentOperation] = useState('');

  // 確保只在客戶端渲染完成後顯示內容
  useEffect(() => {
    setMounted(true);
  }, []);

  // 使用 refs 替代 document.getElementById
  const narrativeInputRef = useRef<HTMLInputElement>(null);
  const bulletInputRef = useRef<HTMLInputElement>(null);
  const tableInputRef = useRef<HTMLInputElement>(null);

  const callApi = async (endpoint: string, payload: any) => {
    setLoading(true);
    setCurrentOperation(`正在${endpoint}...`);
    
    try {
      const res = await fetch(`/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      
      const data = await res.json();
      return data.result;
    } catch (error) {
      console.error(`${endpoint} 錯誤:`, error);
      alert(`生成內容時發生錯誤: ${error}`);
      return '';
    } finally {
      setLoading(false);
      setCurrentOperation('');
    }
  };

  const generateTitle = async () => {
    if (!keywords.trim()) {
      alert('請先輸入關鍵字');
      return;
    }
    const result = await callApi('generate-title', { keywords });
    if (result) setTitle(result);
  };

  const generateOutline = async () => {
    if (!keywords.trim()) {
      alert('請先輸入關鍵字');
      return;
    }
    const result = await callApi('generate-outline', { keywords, title });
    if (result) setOutline(result);
  };

  const generateIntro = async () => {
    if (!keywords.trim()) {
      alert('請先輸入關鍵字');
      return;
    }
    if (!title.trim()) {
      alert('請先生成標題');
      return;
    }
    const result = await callApi('generate-intro', { keywords, title });
    if (result) setIntro(result);
  };

  const generateH2 = async (type: string, h2Title: string, inputRef: React.RefObject<HTMLInputElement>) => {
    if (!h2Title.trim()) {
      alert('請輸入 H2 標題');
      return;
    }
    if (!keywords.trim()) {
      alert('請先輸入關鍵字');
      return;
    }
    
    const content = await callApi('generate-h2', { h2Title, keywords, type });
    if (content) {
      setH2Sections(prev => [...prev, { h2Title, type, content }]);
      // 清空輸入框
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const generateCTA = async (ctaKeywords: string) => {
    if (!ctaKeywords.trim()) {
      alert('請輸入品牌關鍵字');
      return;
    }
    const result = await callApi('generate-cta', { keywords: ctaKeywords });
    if (result) setCta(result);
  };

  const removeH2Section = (index: number) => {
    setH2Sections(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    if (confirm('確定要清除所有內容嗎？')) {
      setTitle('');
      setOutline('');
      setIntro('');
      setH2Sections([]);
      setCta('');
      setKeywords('');
    }
  };

  // 防止 hydration 錯誤，確保客戶端渲染完成
  if (!mounted) {
    return (
      <>
        <Head>
          <title>AI 寫作模版 - SEO 內容產生器</title>
          <meta name="description" content="使用 AI 技術快速生成高品質的 SEO 內容" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">載入中...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>AI 寫作模版 - SEO 內容產生器</title>
        <meta name="description" content="使用 AI 技術快速生成高品質的 SEO 內容" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-orange-100">
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          
          {/* 簡潔的標題區域 */}
          <div className="text-center py-8">
            <h1 className="text-3xl font-bold text-orange-900 mb-4">AI 寫作模版</h1>
            <p className="text-orange-700 mb-6">使用 AI 技術快速生成專業 SEO 內容</p>
            <button 
              onClick={clearAll} 
              className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded-xl hover:bg-red-50 transition-colors"
            >
              清除所有內容
            </button>
          </div>

          {/* 標題生成 */}
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
            <div className="bg-white px-6 py-4 border-b border-orange-100">
              <h2 className="text-lg font-semibold text-orange-900">標題</h2>
            </div>
            <div className="p-6">
              <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
                <p className="text-sm text-orange-700">
                  <strong>指令：</strong>針對關鍵字 <span className="bg-orange-50 border-l-4 border-orange-400 text-orange-700 px-2 py-0.5 rounded">OOO、OOO、OOO</span>，根據關鍵字搜尋意圖，產生 SEO 標題。
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-2">關鍵字輸入：</label>
                  <input 
                    type="text"
                    className="w-full px-3 py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                    placeholder="請輸入關鍵字，例如：TypeScript, 程式設計, 教學"
                    value={keywords} 
                    onChange={e => setKeywords(e.target.value)} 
                  />
                </div>
                
                <button 
                  onClick={generateTitle} 
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={loading || !keywords.trim()}
                >
                  {loading && currentOperation.includes('generate-title') ? '生成中...' : '產生標題'}
                </button>
                
                {title && (
                  <div className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-md">
                    <p className="text-sm font-medium text-orange-700 mb-2">生成結果：</p>
                    <p className="text-orange-900">{title}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 文章大綱 */}
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
            <div className="bg-white px-6 py-4 border-b border-orange-100">
              <h2 className="text-lg font-semibold text-orange-900">文章大綱</h2>
            </div>
            <div className="p-6">
              <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
                <p className="text-sm text-orange-700">
                  <strong>指令：</strong>根據標題：<span className="bg-orange-50 border-l-4 border-orange-400 text-orange-700 px-2 py-0.5 rounded">OOOOOO</span>，關鍵字：<span className="bg-orange-50 border-l-4 border-orange-400 text-orange-700 px-2 py-0.5 rounded">OOO、OOO、OOO</span>，產生一個 SEO 文章大綱。
                </p>
              </div>
              
              <button 
                onClick={generateOutline} 
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4"
                disabled={loading || !keywords.trim()}
              >
                {loading && currentOperation.includes('generate-outline') ? '生成中...' : '產生大綱'}
              </button>
              
              {outline && (
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-md">
                  <p className="text-sm font-medium text-orange-700 mb-2">大綱結果：</p>
                  <pre className="whitespace-pre-wrap text-sm text-orange-700 font-mono">{outline}</pre>
                </div>
              )}
            </div>
          </div>

          {/* 前言 */}
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
            <div className="bg-white px-6 py-4 border-b border-orange-100">
              <h2 className="text-lg font-semibold text-orange-900">前言</h2>
            </div>
            <div className="p-6">
              <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
                <p className="text-sm text-orange-700">
                  <strong>指令：</strong>依據關鍵字：<span className="bg-orange-50 border-l-4 border-orange-400 text-orange-700 px-2 py-0.5 rounded">OOO、OOO、OOO</span>，生出一段文字前言，字數在 200 字以內。
                </p>
              </div>
              
              <button 
                onClick={generateIntro} 
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4"
                disabled={loading || !keywords.trim() || !title.trim()}
              >
                {loading && currentOperation.includes('generate-intro') ? '生成中...' : '產生前言'}
              </button>
              
              {intro && (
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-md">
                  <p className="text-sm font-medium text-orange-700 mb-2">前言結果：</p>
                  <p className="text-orange-700">{intro}</p>
                </div>
              )}
            </div>
          </div>

          {/* H2 內容生成 - 簡潔版本 */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* H2：敘述式 */}
            <div className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
              <div className="bg-white px-4 py-3 border-b border-orange-100">
                <h3 className="font-medium text-orange-900">H2：敘述式</h3>
              </div>
              <div className="p-4">
                <div className="bg-orange-50 border-l-4 border-orange-400 p-3 mb-4">
                  <p className="text-xs text-orange-700">
                    <strong>指令：</strong>依據提供的 H2（<span className="bg-orange-50 border-l-4 border-orange-400 text-orange-700 px-1 rounded">OOOOOOO</span>）產生一段內容，約 250 字。
                  </p>
                </div>
                
                <div className="space-y-3">
                  <input 
                    ref={narrativeInputRef}
                    type="text"
                    className="w-full px-3 py-2 text-sm border border-orange-200 rounded focus:outline-none focus:ring-1 focus:ring-orange-400"
                    placeholder="輸入敘述式的 H2 標題"
                  />
                  <button
                    className="w-full px-4 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded disabled:opacity-50 transition-colors"
                    disabled={loading}
                    onClick={() => {
                      const value = narrativeInputRef.current?.value || '';
                      generateH2('narrative', value, narrativeInputRef);
                    }}
                  >
                    產生內容
                  </button>
                </div>
              </div>
            </div>

            {/* H2：列點式 */}
            <div className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
              <div className="bg-white px-4 py-3 border-b border-orange-100">
                <h3 className="font-medium text-orange-900">H2：列點式</h3>
              </div>
              <div className="p-4">
                <div className="bg-orange-50 border-l-4 border-orange-400 p-3 mb-4">
                  <p className="text-xs text-orange-700">
                    <strong>指令：</strong>依據提供的 H2、H3（<span className="bg-orange-50 border-l-4 border-orange-400 text-orange-700 px-1 rounded">OOOOOOO</span>）產生文案，約 250 字。
                  </p>
                </div>
                
                <div className="space-y-3">
                  <input 
                    ref={bulletInputRef}
                    type="text"
                    className="w-full px-3 py-2 text-sm border border-orange-200 rounded focus:outline-none focus:ring-1 focus:ring-orange-400"
                    placeholder="輸入列點式的 H2 標題"
                  />
                  <button
                    className="w-full px-4 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded disabled:opacity-50 transition-colors"
                    disabled={loading}
                    onClick={() => {
                      const value = bulletInputRef.current?.value || '';
                      generateH2('bullet', value, bulletInputRef);
                    }}
                  >
                    產生內容
                  </button>
                </div>
              </div>
            </div>

            {/* H2：表格式 */}
            <div className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
              <div className="bg-white px-4 py-3 border-b border-orange-100">
                <h3 className="font-medium text-orange-900">H2：表格式</h3>
              </div>
              <div className="p-4">
                <div className="bg-orange-50 border-l-4 border-orange-400 p-3 mb-4">
                  <p className="text-xs text-orange-700">
                    <strong>指令：</strong>依據提供的 H2、H3（<span className="bg-orange-50 border-l-4 border-orange-400 text-orange-700 px-1 rounded">OOOOOOO</span>）產生表格（markdown 語法）
                  </p>
                </div>
                
                <div className="space-y-3">
                  <input 
                    ref={tableInputRef}
                    type="text"
                    className="w-full px-3 py-2 text-sm border border-orange-200 rounded focus:outline-none focus:ring-1 focus:ring-orange-400"
                    placeholder="輸入表格式的 H2 標題"
                  />
                  <button
                    className="w-full px-4 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded disabled:opacity-50 transition-colors"
                    disabled={loading}
                    onClick={() => {
                      const value = tableInputRef.current?.value || '';
                      generateH2('table', value, tableInputRef);
                    }}
                  >
                    產生內容
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 已生成的 H2 內容 */}
          {h2Sections.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-orange-100">
              <div className="bg-white px-6 py-4 border-b border-orange-100">
                <h2 className="text-lg font-semibold text-orange-900">已生成的 H2 內容</h2>
              </div>
              <div className="p-6 space-y-4">
                {h2Sections.map((sec, idx) => (
                  <div key={idx} className="border border-orange-100 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-orange-50 px-4 py-3 flex justify-between items-center">
                      <h4 className="font-medium text-orange-900">
                        {sec.h2Title} 
                        <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                          {sec.type === 'narrative' ? '敘述式' : sec.type === 'bullet' ? '列點式' : '表格式'}
                        </span>
                      </h4>
                      <button 
                        onClick={() => removeH2Section(idx)}
                        className="text-xs px-3 py-1 text-red-600 border border-red-300 rounded-xl hover:bg-red-50 transition-colors"
                      >
                        刪除
                      </button>
                    </div>
                    <div className="p-4 bg-orange-50">
                      <pre className="whitespace-pre-wrap text-sm text-orange-700 font-mono">{sec.content}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
            <div className="bg-white px-6 py-4 border-b border-orange-100">
              <h2 className="text-lg font-semibold text-orange-900">H2：CTA</h2>
            </div>
            <div className="p-6">
              <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
                <p className="text-sm text-orange-700">
                  <strong>指令：</strong>依據提供的品牌名稱 <span className="bg-orange-50 border-l-4 border-orange-400 text-orange-700 px-2 py-0.5 rounded">OOO</span>，整理出一段特色介紹 <span className="bg-orange-50 border-l-4 border-orange-400 text-orange-700 px-2 py-0.5 rounded">OOO</span>，並生成一個 CTA，約 200 字，請閱讀者前往（商品頁連結、LINE 諮詢）
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-2">品牌/產品關鍵字：</label>
                  <input 
                    type="text"
                    className="w-full px-3 py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                    placeholder="輸入品牌/產品關鍵字，例如：我的 TypeScript 線上課程"
                    onBlur={e => {
                      if (e.target.value.trim()) {
                        generateCTA(e.target.value);
                      }
                    }}
                  />
                </div>
                
                {cta && (
                  <div className="p-4 bg-orange-50 border border-orange-100 rounded-md">
                    <p className="text-sm font-medium text-orange-700 mb-2">CTA 結果：</p>
                    <p className="text-orange-700">{cta}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 簡潔的載入狀態 */}
          {loading && (
            <div className="fixed bottom-4 right-4 bg-white border border-orange-100 rounded-xl shadow-lg px-4 py-3">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent"></div>
                <span className="text-sm text-orange-700">{currentOperation}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}