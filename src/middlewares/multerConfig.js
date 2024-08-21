// src/middlewares/multerConfig.js
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener la ruta actual del archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads')); // Ruta para guardar los archivos
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre del archivo
    }
});

// Inicialización de multer
const upload = multer({ storage });

export default upload;
