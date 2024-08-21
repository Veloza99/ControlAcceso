// src/controllers/barcodeController.js
import fs from 'fs';
import path from 'path';

// Endpoint para subir la imagen
export const uploadImage = async (req, res) => {
    try {
        // Verificar si se ha subido un archivo
        if (!req.file) {
            return res.status(400).json({ message: 'No se ha subido ninguna imagen' });
        }

        // Ruta donde se ha guardado el archivo
        const imagePath = path.join(path.resolve(), 'uploads', req.file.filename);

        // Confirmar que el archivo existe
        if (!fs.existsSync(imagePath)) {
            return res.status(404).json({ message: 'Archivo no encontrado', filePath: imagePath });
        }

        res.status(200).json({ message: 'Imagen subida exitosamente', filePath: imagePath });
    } catch (error) {
        res.status(500).json({ message: 'Error al procesar la imagen', error: error.message });
    }
};
