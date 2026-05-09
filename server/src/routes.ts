import { Router } from 'express';
import { login, register } from './modules/auth/auth.controller';
import { authMiddleware } from './middlewares/auth.middleware';
// Import your other controllers (CV, Interview, etc.)

const router = Router();

// --- PUBLIC ROUTES ---
router.post('/auth/register', register);
router.post('/auth/login', login);

// --- PROTECTED ROUTES (Require Login) ---
// By adding authMiddleware here, these routes are now secured
router.use('/cv', authMiddleware); 
router.use('/interview', authMiddleware);
router.use('/feedback', authMiddleware);

export default router;
