import type { NextApiRequest, NextApiResponse } from 'next';
import { generateIntroduction } from '../../lib/seoGenerator';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只允許 POST 請求' });
  }

  const { keywords, title } = req.body;
  
  if (!keywords || !title) {
    return res.status(400).json({ error: '缺少關鍵字或標題參數' });
  }

  try {
    const result = await generateIntroduction(keywords, title);
    res.status(200).json({ result });
  } catch (error) {
    console.error('生成前言時發生錯誤:', error);
    res.status(500).json({ error: String(error) });
  }
}