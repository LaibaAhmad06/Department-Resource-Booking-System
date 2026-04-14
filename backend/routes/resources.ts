
import { Router } from 'express';
import { db } from '../db/controller';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { UserRole } from '../../types';

const router = Router();

router.get('/', authenticateToken, async (req, res) => {
  const resources = await db.getResources();
  res.json(resources);
});

router.get('/:id', authenticateToken, async (req, res) => {
  const resource = await db.getResourceById(req.params.id);
  if (!resource) return res.status(404).json({ message: 'Not found' });
  res.json(resource);
});

router.post('/', authenticateToken, authorizeRole([UserRole.ADMIN]), async (req, res) => {
  const newRes = { ...req.body, id: `res-${Date.now()}` };
  await db.addResource(newRes);
  res.status(201).json(newRes);
});

router.delete('/:id', authenticateToken, authorizeRole([UserRole.ADMIN]), async (req, res) => {
  await db.deleteResource(req.params.id);
  res.status(204).send();
});

export default router;
