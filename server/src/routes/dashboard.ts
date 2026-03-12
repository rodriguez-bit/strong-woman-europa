import { Router, Request, Response } from 'express';
import * as service from '../services/dashboardService';

const router = Router();

router.get('/stats', (_req: Request, res: Response) => {
  res.json(service.getStats());
});

router.get('/top-prospects', (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  res.json(service.getTopProspects(limit));
});

router.get('/timeline', (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
  res.json(service.getTimeline(limit));
});

export default router;
