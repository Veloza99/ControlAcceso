import { Router } from 'express';
import { createEntry, registerExit, getEntries, getEntryById, getEntriesInRange, registerVisitorEntry, getVisitorEntries, registerVisitorExit, getVisitorsPendingExit } from '../controllers/entryController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
//import { authorize } from '../middlewares/authorizeMiddleware.js';

const router = Router();

// Entradas y salidas
router.post('/user-entry', authenticateToken, createEntry);
router.post('/user-exit', authenticateToken, registerExit);
// Listar
router.get('/user-all/:identificacion', authenticateToken, getEntries);
router.get('/user-list/:userId', authenticateToken, getEntryById);
// Ruta para consultar entradas y salidas en un rango de fechas
router.get('/entries', authenticateToken, getEntriesInRange);

//Visitantes
// Ruta para registrar la entrada de un visitante
router.post('/visitor-entry', registerVisitorEntry);
// Ruta para la salida del visitante
router.post('/visitor-exit', registerVisitorExit);
// Ruta para obtener el historial de entradas de un visitante por su número de documento
router.get('/visitor-entries/:documentNumber', getVisitorEntries);
// Ruta para obtener el historial de entradas los visitantes actuales
router.get('/visitor-all-entries', getVisitorsPendingExit);

export { router as entryRoutes };