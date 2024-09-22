import { Router } from 'express';
import {
    createEntry,
    registerExit,
    getEntries,
    getEntryById,
    getEntriesInRange,
    registerVisitorEntry,
    getVisitorEntries,
    registerVisitorExit,
    getVisitorsPendingExit, getAllEntries,
} from '../controllers/entryController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
//import { authorize } from '../middlewares/authorizeMiddleware.js';

const router = Router();

// Entradas y salidas de usuarios (rutas sin parámetros)
router.post('/user-entry', authenticateToken, createEntry);
router.post('/user-exit', authenticateToken, registerExit);
router.get('/entries', authenticateToken, getEntriesInRange);
router.get('/all-entries', authenticateToken, getAllEntries);

// Visitantes (rutas sin parámetros)
router.post('/visitor-entry', registerVisitorEntry);
router.post('/visitor-exit', registerVisitorExit);
router.get('/visitor-all-entries', getVisitorsPendingExit);

// Entradas y salidas de usuarios (rutas con parámetros)
router.get('/user-all/:identificacion', authenticateToken, getEntries);
router.get('/user-list/:userId', authenticateToken, getEntryById);

// Visitantes (rutas con parámetros)
router.get('/visitor-entries/:documentNumber', getVisitorEntries);

export { router as entryRoutes };
