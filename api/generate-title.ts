// pages/api/generate-title.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { generateTitle } from '../../lib/seoGenerator'; // 引入你的後端函式

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { keywords } = req.body;
  try {
    const result = await generateTitle(keywords);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
}