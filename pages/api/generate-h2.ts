import type { NextApiRequest, NextApiResponse } from 'next';
import { generateH2Content } from '../../lib/seoGenerator';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只允許 POST 請求' });
  }

  const { h2Title, keywords, type } = req.body;
  
  if (!h2Title || !keywords || !type) {
    return res.status(400).json({ error: '缺少必要參數' });
  }

  if (!['narrative', 'bullet', 'table'].includes(type)) {
    return res.status(400).json({ error: '不支援的內容類型' });
  }

  try {
    const result = await generateH2Content(h2Title, keywords, type);
    res.status(200).json({ result });
  } catch (error) {
    console.error('生成 H2 內容時發生錯誤:', error);
    res.status(500).json({ error: String(error) });
  }
}