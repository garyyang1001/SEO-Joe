import { useState } from 'react';

export default function Home() {
  const [keywords, setKeywords] = useState('');
  const [title, setTitle] = useState('');
  const [outline, setOutline] = useState('');
  const [intro, setIntro] = useState('');
  const [h2Sections, setH2Sections] = useState([]);
  const [cta, setCta] = useState('');
  const [loading, setLoading] = useState(false);

  const callApi = async (endpoint: string, payload: any) => {
    setLoading(true);
    const res = await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setLoading(false);
    return data.result;
  };

  const generateTitle = async () => setTitle(await callApi('generate-title', { keywords }));
  const generateOutline = async () => setOutline(await callApi('generate-outline', { keywords }));
  const generateIntro = async () => setIntro(await callApi('generate-intro', { keywords, title }));
  const generateH2 = async (type: string, h2Title: string) => {
    const content = await callApi('generate-h2', { h2Title, keywords, type });
    setH2Sections(prev => [...prev, { h2Title, type, content }]);
  };
  const generateCTA = async (ctaKeywords: string) => setCta(await callApi('generate-cta', { keywords: ctaKeywords }));

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">AI SEO 內容產生器</h1>

      <div>
        <label>主要關鍵字：</label>
        <input className="border p-2 w-full" value={keywords} onChange={e => setKeywords(e.target.value)} />
        <button onClick={generateTitle} className="mt-2 btn">產生標題</button>
        <p>{title}</p>
      </div>

      <div>
        <button onClick={generateOutline} className="btn">產生大綱</button>
        <pre className="whitespace-pre-wrap">{outline}</pre>
      </div>

      <div>
        <button onClick={generateIntro} className="btn">產生前言</button>
        <p>{intro}</p>
      </div>

      <div>
        <h2>H2 內容生成</h2>
        {['narrative', 'bullet', 'table'].map(type => (
          <div key={type}>
            <label>{type} 標題：</label>
            <input id={`h2-${type}`} className="border p-1 w-full" placeholder={`輸入 ${type} 類型的 H2 標題`} />
            <button
              className="btn mt-1"
              onClick={() => generateH2(type, (document.getElementById(`h2-${type}`) as HTMLInputElement).value)}
            >產生內容</button>
          </div>
        ))}
        <div>
          {h2Sections.map((sec, idx) => (
            <div key={idx} className="mt-4 border p-2">
              <h3>{sec.h2Title} ({sec.type})</h3>
              <pre className="whitespace-pre-wrap">{sec.content}</pre>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label>品牌關鍵字 (CTA)：</label>
        <input className="border p-2 w-full" onBlur={e => generateCTA(e.target.value)} />
        <p>{cta}</p>
      </div>

      {loading && <p className="text-blue-600">處理中...</p>}
    </div>
  );
}