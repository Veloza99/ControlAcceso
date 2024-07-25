import { Router } from 'express';
import { createEntry, registerExit, getEntries, getEntryById, getEntriesInRange } from '../controllers/entryController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
//import { authorize } from '../middlewares/authorizeMiddleware.js';

const router = Router();

// Entradas y salidas
router.post('/', authenticateToken, createEntry);
router.post('/exit', authenticateToken, registerExit);
// Listar
router.get('/', authenticateToken, getEntries);
router.get('/:id', authenticateToken, getEntryById);
// Ruta para consultar entradas y salidas en un rango de fechas
router.get('/entries', authenticateToken, getEntriesInRange);

export { router as entryRoutes };