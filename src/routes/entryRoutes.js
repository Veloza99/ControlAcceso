import { Router } from 'express';
import { createEntry, registerExit, getEntries, getEntryById, getEntriesInRange } from '../controllers/entryController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { registerVisitorEntry, getVisitorEntries } from '../controllers/entryController.js';
//import { authorize } from '../middlewares/authorizeMiddleware.js';

const router = Router();

// Entradas y salidas
router.post('/', authenticateToken, createEntry);
router.post('/exit', authenticateToken, registerExit);
// Listar
router.get('/all/:identificacion', authenticateToken, getEntries);
router.get('/:userId', authenticateToken, getEntryById);
// Ruta para consultar entradas y salidas en un rango de fechas
router.get('/entries', authenticateToken, getEntriesInRange);

//Visitantes
// Ruta para registrar la entrada de un visitante
router.post('/register-entry', registerVisitorEntry);
// Ruta para obtener el historial de entradas de un visitante por su número de documento
router.get('/entries/:documentNumber', getVisitorEntries);
// Ruta para obtener el historial de entradas los visitantes actuales
router.get('/entries-visitor/', getVisitorEntries);

export { router as entryRoutes };