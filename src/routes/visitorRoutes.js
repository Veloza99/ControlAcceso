import express from 'express';
import { createVisitor } from '../controllers/visitorController.js';

const router = express.Router();

// Ruta para registrar visitante
router.post('/register', createVisitor);

export {router as visitorRoutes}
