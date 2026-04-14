
import { Router } from 'express';
import { db } from '../db/controller';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { UserRole, BookingStatus } from '../../types';

const router = Router();

router.get('/', authenticateToken, async (req: any, res) => {
  let bookings = await db.getBookings();
  if (req.user.role === UserRole.USER) {
    bookings = bookings.filter(b => b.userId === req.user.id);
  }
  res.json(bookings);
});

router.post('/', authenticateToken, async (req: any, res) => {
  const { resourceId, resourceName, date, slot } = req.body;

  // Conflict Check
  const allBookings = await db.getBookings();
  const conflict = allBookings.find(b => 
    b.resourceId === resourceId && b.date === date && b.slot === slot && b.status === BookingStatus.APPROVED
  );

  if (conflict) return res.status(409).json({ message: 'Time slot already approved for another user.' });

  const newBooking = {
    id: `book-${Date.now()}`,
    userId: req.user.id,
    userName: req.user.name,
    resourceId, resourceName, date, slot,
    status: BookingStatus.PENDING,
    createdAt: new Date().toISOString()
  };

  await db.createBooking(newBooking);
  res.status(201).json(newBooking);
});

router.patch('/:id/status', authenticateToken, authorizeRole([UserRole.ADMIN]), async (req, res) => {
  const { status } = req.body;
  await db.updateBookingStatus(req.params.id, status);
  res.json({ message: 'Status updated' });
});

export default router;
