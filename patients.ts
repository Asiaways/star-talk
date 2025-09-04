import type { VercelRequest, VercelResponse } from 'vercel';
import { prisma } from '../_lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse){
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if(token !== process.env.ADMIN_TOKEN) return res.status(401).json({ error: 'Unauthorized' });
  if(req.method !== 'GET') return res.status(405).end();
  const items = await prisma.patient.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
  res.json({ items });
}
