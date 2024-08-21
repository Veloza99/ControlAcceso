// src/routes/barcodeRoutes.js
import express from 'express';
import { uploadImage } from '../controllers/barcodeController.js';
import upload from '../middlewares/multerConfig.js';

const router = express.Router();

// Ruta para subir la imagen y decodificar el código de barras
router.post('/upload', upload.single('image'), uploadImage);

export { router as barcodeRoutes };
