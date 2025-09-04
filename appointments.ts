import type { VercelRequest, VercelResponse } from 'vercel';
import { prisma } from '../_lib/prisma';

export default async function handler(req: VercelRequest, res: VercelResponse){
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if(token !== process.env.ADMIN_TOKEN) return res.status(401).json({ error: 'Unauthorized' });
  if(req.method !== 'GET') return res.status(405).end();
  const items = await prisma.appointment.findMany({ include: { patient: true }, orderBy: { createdAt: 'desc' }, take: 50 });
  const out = items.map(i => ({
    createdAt: i.createdAt,
    department: i.department,
    status: i.status,
    patient: { fullName: i.patient?.fullName || '', email: i.patient?.email || '' }
  }));
  res.json({ items: out });
}
