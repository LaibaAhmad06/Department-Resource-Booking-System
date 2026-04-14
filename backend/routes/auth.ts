
import { Router } from 'express';
import { db } from '../db/controller';
import { UserRole } from '../../types';

const router = Router();

// Simulated JWT creation (Base64 encoding for prototype)
const createToken = (payload: any) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const data = btoa(JSON.stringify(payload));
  return `${header}.${data}.signature`;
};

router.post('/signup', async (req, res) => {
  const { name, email, role, password } = req.body;
  
  if (!email.endsWith('@itu.edu.pk')) {
    return res.status(400).json({ message: 'Restricted domain. Use @itu.edu.pk' });
  }

  const existing = await db.findUserByEmail(email);
  if (existing) return res.status(400).json({ message: 'User already exists' });

  const newUser = {
    id: `user-${Date.now()}`,
    name, email, role,
    isActive: true,
    createdAt: new Date().toISOString()
  };

  await db.createUser(newUser, password);
  res.status(201).json({ message: 'User created successfully' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.findUserByEmail(email);
  const storedPass = await db.getUserPassword(email);

  if (!user || storedPass !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = createToken({ id: user.id, email: user.email, role: user.role, name: user.name });
  res.json({ token, user });
});

export default router;
