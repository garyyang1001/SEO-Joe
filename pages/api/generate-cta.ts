import type { NextApiRequest, NextApiResponse } from 'next';
import { generateCTA } from '../../lib/seoGenerator';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只允許 POST 請求' });
  }

  const { keywords } = req.body;
  
  if (!keywords) {
    return res.status(400).json({ error: '缺少關鍵字參數' });
  }

  try {
    const result = await generateCTA(keywords);
    res.status(200).json({ result });
  } catch (error) {
    console.error('生成 CTA 時發生錯誤:', error);
    res.status(500).json({ error: String(error) });
  }
}