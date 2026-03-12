import { queryAll, queryOne, execute, lastInsertId } from '../utils/dbHelpers';

export interface ContactLogInput {
  collaborator_id: number;
  date?: string;
  method: string;
  direction?: string;
  note: string;
  created_by?: string;
  follow_up_date?: string;
}

export function listContacts(collaboratorId: number) {
  return queryAll('SELECT * FROM contact_log WHERE collaborator_id = ? ORDER BY date DESC', [collaboratorId]);
}

export function addContact(input: ContactLogInput) {
  execute(`
    INSERT INTO contact_log (collaborator_id, date, method, direction, note, created_by, follow_up_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    input.collaborator_id,
    input.date || new Date().toISOString(),
    input.method,
    input.direction || 'outbound',
    input.note,
    input.created_by || null,
    input.follow_up_date || null,
  ]);
  const id = lastInsertId();
  return queryOne('SELECT * FROM contact_log WHERE id = ?', [id]);
}

export function updateContact(id: number, input: Partial<ContactLogInput>) {
  const existing = queryOne('SELECT * FROM contact_log WHERE id = ?', [id]);
  if (!existing) return null;

  const merged = { ...existing, ...input };
  execute(`
    UPDATE contact_log SET method=?, direction=?, note=?, created_by=?, follow_up_date=?, date=?
    WHERE id=?
  `, [merged.method, merged.direction, merged.note, merged.created_by, merged.follow_up_date, merged.date, id]);

  return queryOne('SELECT * FROM contact_log WHERE id = ?', [id]);
}

export function deleteContact(id: number): boolean {
  const existing = queryOne('SELECT id FROM contact_log WHERE id = ?', [id]);
  if (!existing) return false;
  execute('DELETE FROM contact_log WHERE id = ?', [id]);
  return true;
}

export function markFollowUpDone(id: number) {
  execute('UPDATE contact_log SET follow_up_done = 1 WHERE id = ?', [id]);
  return queryOne('SELECT * FROM contact_log WHERE id = ?', [id]);
}

export function getPendingFollowUps(dueBefore?: string) {
  let query = `
    SELECT cl.*, c.name as collaborator_name, c.country, c.profession
    FROM contact_log cl
    JOIN collaborators c ON cl.collaborator_id = c.id
    WHERE cl.follow_up_done = 0 AND cl.follow_up_date IS NOT NULL
  `;
  const params: any[] = [];
  if (dueBefore) {
    query += ' AND cl.follow_up_date <= ?';
    params.push(dueBefore);
  }
  query += ' ORDER BY cl.follow_up_date ASC';
  return queryAll(query, params);
}
