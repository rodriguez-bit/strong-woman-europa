import { Router, Request, Response } from 'express';
import * as aiService from '../services/aiService';
import { getCollaborator, listCollaborators } from '../services/collaboratorService';

const router = Router();

router.post('/suggest', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'query is required' });
    const suggestions = await aiService.suggestCollaborators(query);
    res.json({ suggestions });
  } catch (err: any) {
    console.error('AI suggest error:', err.message);
    res.status(500).json({ error: 'AI service error: ' + err.message });
  }
});

router.post('/analyze/:id', async (req: Request, res: Response) => {
  try {
    const collaborator = getCollaborator(parseInt(req.params.id as string));
    if (!collaborator) return res.status(404).json({ error: 'Not found' });
    const analysis = await aiService.analyzeCollaborator(collaborator);
    res.json({ analysis });
  } catch (err: any) {
    console.error('AI analyze error:', err.message);
    res.status(500).json({ error: 'AI service error: ' + err.message });
  }
});

router.post('/bulk-recommend', async (req: Request, res: Response) => {
  try {
    const { criteria } = req.body;
    const result = listCollaborators({
      country: criteria?.country,
      profession: criteria?.profession,
      follower_min: criteria?.min_followers,
      limit: 50,
    });
    const recommendation = await aiService.bulkRecommend(criteria || {}, result.data);
    res.json({ recommendation });
  } catch (err: any) {
    console.error('AI bulk-recommend error:', err.message);
    res.status(500).json({ error: 'AI service error: ' + err.message });
  }
});

export default router;
