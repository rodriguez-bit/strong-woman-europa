import { Router, Request, Response } from 'express';
import * as service from '../services/collaboratorService';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const filters = {
    country: req.query.country as string,
    profession: req.query.profession as string,
    contact_status: req.query.contact_status as string,
    project_phase: req.query.project_phase as string,
    priority: req.query.priority as string,
    follower_min: req.query.follower_min ? parseInt(req.query.follower_min as string) : undefined,
    follower_max: req.query.follower_max ? parseInt(req.query.follower_max as string) : undefined,
    search: req.query.search as string,
    sort: req.query.sort as string,
    order: req.query.order as 'asc' | 'desc',
    page: req.query.page ? parseInt(req.query.page as string) : undefined,
    limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
  };
  res.json(service.listCollaborators(filters));
});

router.get('/:id', (req: Request, res: Response) => {
  const result = service.getCollaborator(parseInt(req.params.id as string));
  if (!result) return res.status(404).json({ error: 'Not found' });
  res.json(result);
});

router.post('/', (req: Request, res: Response) => {
  if (!req.body.name || !req.body.country || !req.body.profession) {
    return res.status(400).json({ error: 'name, country, and profession are required' });
  }
  const result = service.createCollaborator(req.body);
  res.status(201).json(result);
});

router.put('/:id', (req: Request, res: Response) => {
  const result = service.updateCollaborator(parseInt(req.params.id as string), req.body);
  if (!result) return res.status(404).json({ error: 'Not found' });
  res.json(result);
});

router.delete('/:id', (req: Request, res: Response) => {
  const deleted = service.deleteCollaborator(parseInt(req.params.id as string));
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
});

router.patch('/:id/status', (req: Request, res: Response) => {
  const { contact_status, project_phase, priority } = req.body;
  const result = service.updateStatus(parseInt(req.params.id as string), { contact_status, project_phase, priority });
  if (!result) return res.status(404).json({ error: 'Not found' });
  res.json(result);
});

export default router;
