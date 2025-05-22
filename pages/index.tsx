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
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <div className="loading-spinner mb-6 mx-auto"></div>
            <p className="text-gray-600 text-lg">載入中...</p>
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

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 bg-grid">
        {/* 背景裝飾 */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-bounce-subtle"></div>
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-bounce-subtle" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto p-6 space-y-8">
          
          {/* 現代化標題區域 */}
          <div className="text-center py-12 animate-fade-in">
            <div className="mb-6">
              <h1 className="text-5xl md:text-6xl font-bold text-gradient mb-4 animate-slide-up">
                ✨ AI 寫作模版
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                使用最先進的 AI 技術，快速生成專業且優質的 SEO 內容
              </p>
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <span className="badge">🚀 快速生成</span>
                <span className="badge-secondary">📈 SEO 優化</span>
                <span className="badge-success">✅ 專業品質</span>
              </div>
            </div>
            <button 
              onClick={clearAll} 
              className="btn-ghost hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              🗑️ 清除所有內容
            </button>
          </div>

          {/* 關鍵字輸入區 - 固定在頂部 */}
          <div className="card-modern sticky top-4 z-10 bg-white/80 backdrop-blur-sm animate-slide-up">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="section-header text-base mb-3">
                  🎯 關鍵字設定
                </label>
                <input 
                  type="text"
                  className="input-field"
                  placeholder="輸入關鍵字，例如：TypeScript, 程式設計, 教學"
                  value={keywords} 
                  onChange={e => setKeywords(e.target.value)} 
                />
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  keywords.trim() ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-500'
                }`}>
                  {keywords.trim() ? '✅ 已設定' : '⏳ 請輸入'}
                </span>
              </div>
            </div>
          </div>

          {/* 標題生成 */}
          <div className="card-modern animate-fade-in" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-header text-xl">
                📝 標題生成
              </h2>
              {title && <span className="badge-success">已生成</span>}
            </div>
            
            <div className="bg-gradient-to-r from-primary-50 to-orange-50 border-l-4 border-primary-400 p-4 mb-6 rounded-lg">
              <p className="text-sm text-primary-700">
                <strong>💡 AI 指令：</strong>針對關鍵字 
                <span className="bg-primary-200 text-primary-800 px-2 py-1 rounded font-medium mx-1">
                  {keywords || 'OOO、OOO、OOO'}
                </span>
                ，根據關鍵字搜尋意圖，產生 SEO 標題
              </p>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={generateTitle} 
                className={`btn w-full md:w-auto ${loading && currentOperation.includes('generate-title') ? 'opacity-75' : ''}`}
                disabled={loading || !keywords.trim()}
              >
                {loading && currentOperation.includes('generate-title') ? (
                  <>
                    <div className="loading-spinner mr-2"></div>
                    生成中...
                  </>
                ) : '🎨 產生標題'}
              </button>
              
              {title && (
                <div className="card bg-gradient-to-r from-primary-500 to-orange-500 text-white animate-slide-up">
                  <p className="font-medium mb-2 flex items-center">
                    ✨ 生成結果：
                  </p>
                  <p className="text-lg leading-relaxed">{title}</p>
                </div>
              )}
            </div>
          </div>

          {/* 文章大綱 */}
          <div className="card-modern animate-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-header text-xl">
                📋 文章大綱
              </h2>
              {outline && <span className="badge-success">已生成</span>}
            </div>
            
            <div className="bg-gradient-to-r from-secondary-50 to-blue-50 border-l-4 border-secondary-400 p-4 mb-6 rounded-lg">
              <p className="text-sm text-secondary-700">
                <strong>💡 AI 指令：</strong>根據標題：
                <span className="bg-secondary-200 text-secondary-800 px-2 py-1 rounded font-medium mx-1">
                  {title || 'OOOOOO'}
                </span>
                ，關鍵字：
                <span className="bg-secondary-200 text-secondary-800 px-2 py-1 rounded font-medium mx-1">
                  {keywords || 'OOO、OOO、OOO'}
                </span>
                ，產生一個 SEO 文章大綱
              </p>
            </div>
            
            <button 
              onClick={generateOutline} 
              className={`btn-secondary w-full md:w-auto ${loading && currentOperation.includes('generate-outline') ? 'opacity-75' : ''}`}
              disabled={loading || !keywords.trim()}
            >
              {loading && currentOperation.includes('generate-outline') ? (
                <>
                  <div className="loading-spinner mr-2"></div>
                  生成中...
                </>
              ) : '📊 產生大綱'}
            </button>
            
            {outline && (
              <div className="content-output mt-4 animate-slide-up">
                <p className="font-medium mb-2 text-primary-700 flex items-center">
                  📄 大綱結果：
                </p>
                <pre className="whitespace-pre-wrap text-sm text-primary-800 font-mono leading-relaxed">{outline}</pre>
              </div>
            )}
          </div>

          {/* 前言 */}
          <div className="card-modern animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-header text-xl">
                ✍️ 前言
              </h2>
              {intro && <span className="badge-success">已生成</span>}
            </div>
            
            <div className="bg-gradient-to-r from-success-50 to-green-50 border-l-4 border-success-400 p-4 mb-6 rounded-lg">
              <p className="text-sm text-success-700">
                <strong>💡 AI 指令：</strong>依據關鍵字：
                <span className="bg-success-200 text-success-800 px-2 py-1 rounded font-medium mx-1">
                  {keywords || 'OOO、OOO、OOO'}
                </span>
                ，生出一段文字前言，字數在 200 字以內
              </p>
            </div>
            
            <button 
              onClick={generateIntro} 
              className={`btn w-full md:w-auto ${loading && currentOperation.includes('generate-intro') ? 'opacity-75' : ''}`}
              disabled={loading || !keywords.trim() || !title.trim()}
            >
              {loading && currentOperation.includes('generate-intro') ? (
                <>
                  <div className="loading-spinner mr-2"></div>
                  生成中...
                </>
              ) : '🌟 產生前言'}
            </button>
            
            {intro && (
              <div className="card bg-gradient-to-r from-success-500 to-green-500 text-white mt-4 animate-slide-up">
                <p className="font-medium mb-2 flex items-center">
                  📖 前言結果：
                </p>
                <p className="leading-relaxed">{intro}</p>
              </div>
            )}
          </div>

          {/* H2 內容生成 - 現代化網格布局 */}
          <div className="grid lg:grid-cols-3 gap-6 animate-fade-in" style={{animationDelay: '0.4s'}}>
            {/* H2：敘述式 */}
            <div className="card-modern hover:shadow-glow transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-primary-700 flex items-center">
                  📝 敘述式
                </h3>
                <span className="badge">H2</span>
              </div>
              
              <div className="bg-gradient-to-r from-primary-50 to-orange-50 border-l-4 border-primary-400 p-3 mb-4 rounded">
                <p className="text-xs text-primary-700">
                  <strong>💡 指令：</strong>依據提供的 H2 產生一段內容，約 250 字
                </p>
              </div>
              
              <div className="space-y-3">
                <input 
                  ref={narrativeInputRef}
                  type="text"
                  className="input-field text-sm"
                  placeholder="輸入敘述式的 H2 標題"
                />
                <button
                  className="btn w-full text-sm py-2"
                  disabled={loading}
                  onClick={() => {
                    const value = narrativeInputRef.current?.value || '';
                    generateH2('narrative', value, narrativeInputRef);
                  }}
                >
                  ✨ 產生內容
                </button>
              </div>
            </div>

            {/* H2：列點式 */}
            <div className="card-modern hover:shadow-glow transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-secondary-700 flex items-center">
                  📋 列點式
                </h3>
                <span className="badge-secondary">H2</span>
              </div>
              
              <div className="bg-gradient-to-r from-secondary-50 to-blue-50 border-l-4 border-secondary-400 p-3 mb-4 rounded">
                <p className="text-xs text-secondary-700">
                  <strong>💡 指令：</strong>依據提供的 H2、H3 產生文案，約 250 字
                </p>
              </div>
              
              <div className="space-y-3">
                <input 
                  ref={bulletInputRef}
                  type="text"
                  className="input-field text-sm"
                  placeholder="輸入列點式的 H2 標題"
                />
                <button
                  className="btn-secondary w-full text-sm py-2"
                  disabled={loading}
                  onClick={() => {
                    const value = bulletInputRef.current?.value || '';
                    generateH2('bullet', value, bulletInputRef);
                  }}
                >
                  📊 產生內容
                </button>
              </div>
            </div>

            {/* H2：表格式 */}
            <div className="card-modern hover:shadow-glow transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-success-700 flex items-center">
                  📊 表格式
                </h3>
                <span className="badge-success">H2</span>
              </div>
              
              <div className="bg-gradient-to-r from-success-50 to-green-50 border-l-4 border-success-400 p-3 mb-4 rounded">
                <p className="text-xs text-success-700">
                  <strong>💡 指令：</strong>依據提供的 H2、H3 產生表格（markdown 語法）
                </p>
              </div>
              
              <div className="space-y-3">
                <input 
                  ref={tableInputRef}
                  type="text"
                  className="input-field text-sm"
                  placeholder="輸入表格式的 H2 標題"
                />
                <button
                  className="btn w-full text-sm py-2 bg-gradient-to-r from-success-500 to-green-500 hover:shadow-lg"
                  disabled={loading}
                  onClick={() => {
                    const value = tableInputRef.current?.value || '';
                    generateH2('table', value, tableInputRef);
                  }}
                >
                  📋 產生內容
                </button>
              </div>
            </div>
          </div>

          {/* 已生成的 H2 內容 */}
          {h2Sections.length > 0 && (
            <div className="card-modern animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="section-header text-xl">
                  📚 已生成的 H2 內容
                </h2>
                <span className="badge">{h2Sections.length} 個內容</span>
              </div>
              
              <div className="space-y-4">
                {h2Sections.map((sec, idx) => (
                  <div key={idx} className="card border-l-4 border-primary-400 hover:shadow-soft-lg transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-lg text-primary-800 mb-2">
                          {sec.h2Title}
                        </h4>
                        <span className={`badge ${
                          sec.type === 'narrative' ? '' : 
                          sec.type === 'bullet' ? 'badge-secondary' : 'badge-success'
                        }`}>
                          {sec.type === 'narrative' ? '📝 敘述式' : 
                           sec.type === 'bullet' ? '📋 列點式' : '📊 表格式'}
                        </span>
                      </div>
                      <button 
                        onClick={() => removeH2Section(idx)}
                        className="btn-ghost text-red-600 hover:bg-red-50 hover:border-red-300 px-3 py-1 text-sm"
                      >
                        🗑️ 刪除
                      </button>
                    </div>
                    <div className="content-output">
                      <pre className="whitespace-pre-wrap text-sm text-primary-800 font-mono leading-relaxed">{sec.content}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="card-modern animate-fade-in" style={{animationDelay: '0.5s'}}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-header text-xl">
                🚀 CTA 行動呼籲
              </h2>
              {cta && <span className="badge-success">已生成</span>}
            </div>
            
            <div className="bg-gradient-to-r from-warning-50 to-yellow-50 border-l-4 border-warning-400 p-4 mb-6 rounded-lg">
              <p className="text-sm text-warning-700">
                <strong>💡 AI 指令：</strong>依據提供的品牌名稱，整理出一段特色介紹，並生成一個 CTA，約 200 字，請閱讀者前往商品頁或 LINE 諮詢
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🏷️ 品牌/產品關鍵字：
                </label>
                <input 
                  type="text"
                  className="input-field"
                  placeholder="輸入品牌/產品關鍵字，例如：我的 TypeScript 線上課程"
                  onBlur={e => {
                    if (e.target.value.trim()) {
                      generateCTA(e.target.value);
                    }
                  }}
                />
              </div>
              
              {cta && (
                <div className="card bg-gradient-to-r from-warning-500 to-yellow-500 text-white animate-slide-up">
                  <p className="font-medium mb-2 flex items-center">
                    🎯 CTA 結果：
                  </p>
                  <p className="leading-relaxed">{cta}</p>
                </div>
              )}
            </div>
          </div>

          {/* 美化的載入狀態 */}
          {loading && (
            <div className="fixed bottom-6 right-6 z-50">
              <div className="card bg-white/90 backdrop-blur-sm border border-primary-200 shadow-glow animate-bounce-subtle">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="loading-pulse"></div>
                    <div className="loading-pulse"></div>
                    <div className="loading-pulse"></div>
                  </div>
                  <span className="text-sm font-medium text-primary-700">{currentOperation}</span>
                </div>
              </div>
            </div>
          )}

          {/* 頁腳 */}
          <div className="text-center py-8 text-gray-500 text-sm">
            <p>✨ Powered by AI Technology | 讓創意無限延伸</p>
          </div>
        </div>
      </div>
    </>
  );
}