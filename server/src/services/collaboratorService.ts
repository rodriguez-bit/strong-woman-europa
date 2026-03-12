import { queryAll, queryOne, execute, lastInsertId } from '../utils/dbHelpers';
import { calculateRelevanceScore } from '../utils/relevanceScore';

export interface CollaboratorInput {
  name: string;
  country: string;
  city?: string;
  profession: string;
  bio?: string;
  what_makes_special?: string;
  notable_achievements?: string;
  profile_image_url?: string;
  instagram_handle?: string;
  instagram_followers?: number;
  tiktok_handle?: string;
  tiktok_followers?: number;
  youtube_handle?: string;
  youtube_followers?: number;
  twitter_handle?: string;
  twitter_followers?: number;
  email?: string;
  phone?: string;
  manager_name?: string;
  manager_email?: string;
  manager_phone?: string;
  contact_status?: string;
  contact_method?: string;
  project_phase?: string;
  priority?: string;
  assigned_to?: string;
  notes?: string;
}

export interface CollaboratorFilters {
  country?: string;
  profession?: string;
  contact_status?: string;
  project_phase?: string;
  priority?: string;
  follower_min?: number;
  follower_max?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

function computeTotalFollowers(c: CollaboratorInput): number {
  return (c.instagram_followers || 0) + (c.tiktok_followers || 0) +
    (c.youtube_followers || 0) + (c.twitter_followers || 0);
}

function computeScore(c: CollaboratorInput & { total_followers: number }): number {
  return calculateRelevanceScore({
    total_followers: c.total_followers,
    instagram_followers: c.instagram_followers || 0,
    tiktok_followers: c.tiktok_followers || 0,
    youtube_followers: c.youtube_followers || 0,
    twitter_followers: c.twitter_followers || 0,
    country: c.country,
    profession: c.profession,
    project_phase: c.project_phase || 'research',
    priority: c.priority || 'medium',
  });
}

export function listCollaborators(filters: CollaboratorFilters) {
  const conditions: string[] = [];
  const params: any[] = [];

  if (filters.country) { conditions.push('country = ?'); params.push(filters.country); }
  if (filters.profession) { conditions.push('profession = ?'); params.push(filters.profession); }
  if (filters.contact_status) { conditions.push('contact_status = ?'); params.push(filters.contact_status); }
  if (filters.project_phase) { conditions.push('project_phase = ?'); params.push(filters.project_phase); }
  if (filters.priority) { conditions.push('priority = ?'); params.push(filters.priority); }
  if (filters.follower_min) { conditions.push('total_followers >= ?'); params.push(filters.follower_min); }
  if (filters.follower_max) { conditions.push('total_followers <= ?'); params.push(filters.follower_max); }
  if (filters.search) {
    conditions.push('(name LIKE ? OR bio LIKE ? OR notes LIKE ? OR city LIKE ?)');
    const s = `%${filters.search}%`;
    params.push(s, s, s, s);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const sort = filters.sort || 'relevance_score';
  const order = filters.order || 'desc';
  const allowedSorts = ['name', 'country', 'profession', 'total_followers', 'relevance_score', 'created_at', 'updated_at', 'contact_status', 'project_phase', 'priority'];
  const safeSort = allowedSorts.includes(sort) ? sort : 'relevance_score';
  const safeOrder = order === 'asc' ? 'ASC' : 'DESC';

  const page = Math.max(1, filters.page || 1);
  const limit = Math.min(100, Math.max(1, filters.limit || 25));
  const offset = (page - 1) * limit;

  const countRow = queryOne(`SELECT COUNT(*) as total FROM collaborators ${where}`, params);
  const total = countRow?.total || 0;
  const rows = queryAll(`SELECT * FROM collaborators ${where} ORDER BY ${safeSort} ${safeOrder} LIMIT ? OFFSET ?`, [...params, limit, offset]);

  return { data: rows, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export function getCollaborator(id: number) {
  const collaborator = queryOne('SELECT * FROM collaborators WHERE id = ?', [id]);
  if (!collaborator) return null;
  const contacts = queryAll('SELECT * FROM contact_log WHERE collaborator_id = ? ORDER BY date DESC', [id]);
  return { ...collaborator, contacts };
}

export function createCollaborator(input: CollaboratorInput) {
  const total_followers = computeTotalFollowers(input);
  const relevance_score = computeScore({ ...input, total_followers });

  execute(`
    INSERT INTO collaborators (name, country, city, profession, bio, what_makes_special, notable_achievements, profile_image_url,
      instagram_handle, instagram_followers, tiktok_handle, tiktok_followers, youtube_handle, youtube_followers, twitter_handle, twitter_followers,
      email, phone, manager_name, manager_email, manager_phone,
      contact_status, contact_method, project_phase, priority, assigned_to,
      relevance_score, total_followers, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    input.name, input.country, input.city || null, input.profession,
    input.bio || null, input.what_makes_special || null, input.notable_achievements || null, input.profile_image_url || null,
    input.instagram_handle || null, input.instagram_followers || 0,
    input.tiktok_handle || null, input.tiktok_followers || 0,
    input.youtube_handle || null, input.youtube_followers || 0,
    input.twitter_handle || null, input.twitter_followers || 0,
    input.email || null, input.phone || null,
    input.manager_name || null, input.manager_email || null, input.manager_phone || null,
    input.contact_status || 'not_contacted', input.contact_method || null,
    input.project_phase || 'research', input.priority || 'medium', input.assigned_to || null,
    relevance_score, total_followers, input.notes || null,
  ]);

  const id = lastInsertId();
  return getCollaborator(id);
}

export function updateCollaborator(id: number, input: Partial<CollaboratorInput>) {
  const existing = queryOne('SELECT * FROM collaborators WHERE id = ?', [id]);
  if (!existing) return null;

  const merged = { ...existing, ...input };
  const total_followers = computeTotalFollowers(merged);
  const relevance_score = computeScore({ ...merged, total_followers });

  execute(`
    UPDATE collaborators SET
      name=?, country=?, city=?, profession=?, bio=?, what_makes_special=?, notable_achievements=?, profile_image_url=?,
      instagram_handle=?, instagram_followers=?, tiktok_handle=?, tiktok_followers=?,
      youtube_handle=?, youtube_followers=?, twitter_handle=?, twitter_followers=?,
      email=?, phone=?, manager_name=?, manager_email=?, manager_phone=?,
      contact_status=?, contact_method=?, project_phase=?, priority=?, assigned_to=?,
      relevance_score=?, total_followers=?, notes=?, updated_at=CURRENT_TIMESTAMP
    WHERE id=?
  `, [
    merged.name, merged.country, merged.city, merged.profession,
    merged.bio, merged.what_makes_special, merged.notable_achievements, merged.profile_image_url,
    merged.instagram_handle, merged.instagram_followers || 0,
    merged.tiktok_handle, merged.tiktok_followers || 0,
    merged.youtube_handle, merged.youtube_followers || 0,
    merged.twitter_handle, merged.twitter_followers || 0,
    merged.email, merged.phone, merged.manager_name, merged.manager_email, merged.manager_phone,
    merged.contact_status, merged.contact_method, merged.project_phase, merged.priority, merged.assigned_to,
    relevance_score, total_followers, merged.notes, id,
  ]);

  return getCollaborator(id);
}

export function deleteCollaborator(id: number): boolean {
  const existing = queryOne('SELECT id FROM collaborators WHERE id = ?', [id]);
  if (!existing) return false;
  execute('DELETE FROM contact_log WHERE collaborator_id = ?', [id]);
  execute('DELETE FROM collaborators WHERE id = ?', [id]);
  return true;
}

export function updateStatus(id: number, updates: { contact_status?: string; project_phase?: string; priority?: string }) {
  return updateCollaborator(id, updates);
}

export function getAllNames(): string[] {
  const rows = queryAll('SELECT name FROM collaborators');
  return rows.map(r => r.name);
}
