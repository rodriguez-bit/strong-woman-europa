import { Router, Request, Response } from 'express';
import multer from 'multer';
import { createCollaborator } from '../services/collaboratorService';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const router = Router();

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h] = values[idx] || ''; });
    rows.push(row);
  }
  return rows;
}

const FIELD_MAP: Record<string, string> = {
  name: 'name', country: 'country', city: 'city', profession: 'profession',
  bio: 'bio', email: 'email', phone: 'phone', contact: 'email',
  instagram: 'instagram_handle', instagram_handle: 'instagram_handle',
  ig: 'instagram_handle', tiktok: 'tiktok_handle', tiktok_handle: 'tiktok_handle',
  youtube: 'youtube_handle', twitter: 'twitter_handle',
  follower_count: 'instagram_followers', 'follower_count_(m)': 'instagram_followers',
  followers: 'instagram_followers', instagram_followers: 'instagram_followers',
  notes: 'notes', platform: 'contact_method', contacted: 'contact_status',
  response: 'contact_status', project_phase: 'project_phase', priority: 'priority',
  manager: 'manager_name', manager_name: 'manager_name',
  manager_email: 'manager_email', manager_phone: 'manager_phone',
};

router.post('/csv', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const text = req.file.buffer.toString('utf-8');
  const rows = parseCSV(text);

  if (rows.length === 0) return res.status(400).json({ error: 'Empty or invalid CSV' });

  const imported: any[] = [];
  const errors: any[] = [];

  rows.forEach((row, idx) => {
    try {
      const mapped: Record<string, any> = {};
      Object.entries(row).forEach(([key, value]) => {
        const field = FIELD_MAP[key] || key;
        if (value) mapped[field] = value;
      });

      // Handle follower count multiplier (M)
      if (mapped.instagram_followers && typeof mapped.instagram_followers === 'string') {
        const num = parseFloat(mapped.instagram_followers);
        if (!isNaN(num) && num < 1000) {
          mapped.instagram_followers = Math.round(num * 1000000);
        }
      }

      if (!mapped.name || !mapped.country || !mapped.profession) {
        errors.push({ row: idx + 2, error: 'Missing name, country, or profession', data: row });
        return;
      }

      const result = createCollaborator(mapped as any);
      imported.push(result);
    } catch (err: any) {
      errors.push({ row: idx + 2, error: err.message, data: row });
    }
  });

  res.json({ imported: imported.length, errors: errors.length, details: { imported, errors } });
});

router.get('/template', (_req: Request, res: Response) => {
  const csv = 'name,country,city,profession,instagram_handle,instagram_followers,tiktok_handle,tiktok_followers,email,phone,manager_name,manager_email,notes\n';
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=strong-woman-europa-template.csv');
  res.send(csv);
});

export default router;
