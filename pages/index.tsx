import { useState } from 'react';
import Head from 'next/head';

interface H2Section {
  h2Title: string;
  type: string;
  content: string;
}

export default function Home() {
  const [keywords, setKeywords] = useState('');
  const [title, setTitle] = useState('');
  const [outline, setOutline] = useState('');
  const [intro, setIntro] = useState('');
  const [h2Sections, setH2Sections] = useState<H2Section[]>([]);
  const [cta, setCta] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentOperation, setCurrentOperation] = useState('');

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
    const result = await callApi('generate-outline', { keywords });
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

  const generateH2 = async (type: string, h2Title: string) => {
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
      const inputElement = document.getElementById(`h2-${type}`) as HTMLInputElement;
      if (inputElement) inputElement.value = '';
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
    }
  };

  return (
    <>
      <Head>
        <title>AI SEO 內容產生器</title>
        <meta name="description" content="使用 AI 技術快速生成高品質的 SEO 內容" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">AI SEO 內容產生器</h1>
            <p className="text-gray-600">使用 AI 技術快速生成高品質的 SEO 內容</p>
          </div>

          {/* 操作按鈕區 */}
          <div className="flex justify-center space-x-4">
            <button onClick={clearAll} className="btn-secondary">
              清除所有內容
            </button>
          </div>

          {/* 關鍵字輸入 */}
          <div className="card">
            <h2 className="section-header">步驟 1: 主要關鍵字</h2>
            <div className="space-y-4">
              <input 
                className="input-field w-full" 
                placeholder="請輸入主要關鍵字，例如：TypeScript 高效能程式設計"
                value={keywords} 
                onChange={e => setKeywords(e.target.value)} 
              />
              <button 
                onClick={generateTitle} 
                className="btn"
                disabled={loading || !keywords.trim()}
              >
                {loading && currentOperation.includes('generate-title') ? (
                  <>
                    <span className="loading-spinner mr-2"></span>
                    生成中...
                  </>
                ) : (
                  '產生標題'
                )}
              </button>
              {title && (
                <div className="content-output">
                  <strong>生成的標題：</strong><br />
                  {title}
                </div>
              )}
            </div>
          </div>

          {/* 大綱生成 */}
          <div className="card">
            <h2 className="section-header">步驟 2: 文章大綱</h2>
            <button 
              onClick={generateOutline} 
              className="btn mb-4"
              disabled={loading || !keywords.trim()}
            >
              {loading && currentOperation.includes('generate-outline') ? (
                <>
                  <span className="loading-spinner mr-2"></span>
                  生成中...
                </>
              ) : (
                '產生大綱'
              )}
            </button>
            {outline && (
              <div className="content-output">
                {outline}
              </div>
            )}
          </div>

          {/* 前言生成 */}
          <div className="card">
            <h2 className="section-header">步驟 3: 文章前言</h2>
            <button 
              onClick={generateIntro} 
              className="btn mb-4"
              disabled={loading || !keywords.trim() || !title.trim()}
            >
              {loading && currentOperation.includes('generate-intro') ? (
                <>
                  <span className="loading-spinner mr-2"></span>
                  生成中...
                </>
              ) : (
                '產生前言'
              )}
            </button>
            {intro && (
              <div className="content-output">
                {intro}
              </div>
            )}
          </div>

          {/* H2 內容生成 */}
          <div className="card">
            <h2 className="section-header">步驟 4: H2 內容生成</h2>
            <div className="space-y-6">
              {['narrative', 'bullet', 'table'].map(type => {
                const typeNames = {
                  narrative: '敘述式',
                  bullet: '條列式', 
                  table: '表格式'
                };
                
                return (
                  <div key={type} className="border rounded-lg p-4 bg-white">
                    <h3 className="font-semibold mb-3 text-gray-700">
                      {typeNames[type as keyof typeof typeNames]} 內容
                    </h3>
                    <div className="flex space-x-2">
                      <input 
                        id={`h2-${type}`} 
                        className="input-field flex-1" 
                        placeholder={`輸入 ${typeNames[type as keyof typeof typeNames]} 的 H2 標題`} 
                      />
                      <button
                        className="btn"
                        disabled={loading}
                        onClick={() => {
                          const inputElement = document.getElementById(`h2-${type}`) as HTMLInputElement;
                          generateH2(type, inputElement.value);
                        }}
                      >
                        {loading && currentOperation.includes('generate-h2') ? (
                          <>
                            <span className="loading-spinner mr-2"></span>
                            生成中...
                          </>
                        ) : (
                          '產生內容'
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
              
              {/* 顯示已生成的 H2 內容 */}
              {h2Sections.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-700">已生成的 H2 內容：</h3>
                  {h2Sections.map((sec, idx) => (
                    <div key={idx} className="h2-section">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-lg text-gray-800">
                          {sec.h2Title} ({sec.type === 'narrative' ? '敘述式' : sec.type === 'bullet' ? '條列式' : '表格式'})
                        </h4>
                        <button 
                          onClick={() => removeH2Section(idx)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          刪除
                        </button>
                      </div>
                      <div className="content-output">
                        {sec.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CTA 生成 */}
          <div className="card">
            <h2 className="section-header">步驟 5: 行動呼籲 (CTA)</h2>
            <div className="space-y-4">
              <input 
                className="input-field w-full" 
                placeholder="輸入品牌/產品關鍵字，例如：我的 TypeScript 線上課程"
                onBlur={e => {
                  if (e.target.value.trim()) {
                    generateCTA(e.target.value);
                  }
                }}
              />
              {cta && (
                <div className="content-output">
                  <strong>生成的 CTA：</strong><br />
                  {cta}
                </div>
              )}
            </div>
          </div>

          {/* 載入狀態 */}
          {loading && (
            <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <span className="loading-spinner"></span>
                <span>{currentOperation}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}