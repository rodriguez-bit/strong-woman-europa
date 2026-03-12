import { queryAll, queryOne } from '../utils/dbHelpers';

export function getStats() {
  const total = (queryOne('SELECT COUNT(*) as count FROM collaborators') as any).count;
  const byPhase = queryAll('SELECT project_phase, COUNT(*) as count FROM collaborators GROUP BY project_phase');
  const byCountry = queryAll('SELECT country, COUNT(*) as count FROM collaborators GROUP BY country ORDER BY count DESC');
  const byProfession = queryAll('SELECT profession, COUNT(*) as count FROM collaborators GROUP BY profession ORDER BY count DESC');
  const byStatus = queryAll('SELECT contact_status, COUNT(*) as count FROM collaborators GROUP BY contact_status');
  const byPriority = queryAll('SELECT priority, COUNT(*) as count FROM collaborators GROUP BY priority');

  const contacted = (queryOne("SELECT COUNT(*) as count FROM collaborators WHERE contact_status != 'not_contacted'") as any).count;
  const responded = (queryOne("SELECT COUNT(*) as count FROM collaborators WHERE contact_status IN ('in_negotiation', 'agreed')") as any).count;
  const responseRate = contacted > 0 ? Math.round((responded / contacted) * 100) : 0;

  const avgRelevance = (queryOne('SELECT AVG(relevance_score) as avg FROM collaborators') as any).avg || 0;

  return { total, byPhase, byCountry, byProfession, byStatus, byPriority, responseRate, avgRelevance: Math.round(avgRelevance * 10) / 10 };
}

export function getTopProspects(limit: number = 10) {
  return queryAll(`
    SELECT id, name, country, profession, total_followers, relevance_score, contact_status, project_phase, priority, instagram_handle
    FROM collaborators
    WHERE project_phase NOT IN ('completed', 'live')
    ORDER BY relevance_score DESC
    LIMIT ?
  `, [limit]);
}

export function getTimeline(limit: number = 20) {
  return queryAll(`
    SELECT cl.*, c.name as collaborator_name, c.country
    FROM contact_log cl
    JOIN collaborators c ON cl.collaborator_id = c.id
    ORDER BY cl.date DESC
    LIMIT ?
  `, [limit]);
}
