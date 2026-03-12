import { Router, Request, Response } from 'express';
import * as service from '../services/outreachService';

const router = Router();

// Contact log for a collaborator
router.get('/collaborators/:id/contacts', (req: Request, res: Response) => {
  res.json(service.listContacts(parseInt(req.params.id as string)));
});

router.post('/collaborators/:id/contacts', (req: Request, res: Response) => {
  if (!req.body.method || !req.body.note) {
    return res.status(400).json({ error: 'method and note are required' });
  }
  const result = service.addContact({
    collaborator_id: parseInt(req.params.id as string),
    ...req.body,
  });
  res.status(201).json(result);
});

router.put('/contacts/:id', (req: Request, res: Response) => {
  const result = service.updateContact(parseInt(req.params.id as string), req.body);
  if (!result) return res.status(404).json({ error: 'Not found' });
  res.json(result);
});

router.delete('/contacts/:id', (req: Request, res: Response) => {
  const deleted = service.deleteContact(parseInt(req.params.id as string));
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
});

router.patch('/contacts/:id/done', (req: Request, res: Response) => {
  const result = service.markFollowUpDone(parseInt(req.params.id as string));
  if (!result) return res.status(404).json({ error: 'Not found' });
  res.json(result);
});

// Follow-ups
router.get('/follow-ups', (req: Request, res: Response) => {
  res.json(service.getPendingFollowUps(req.query.due_before as string));
});

export default router;
