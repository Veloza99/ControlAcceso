import { Router } from 'express';
import { validationResult } from 'express-validator';
import { register, login } from '../controllers/authController.js';
import { registerValidation, loginValidation } from '../routes/validadores.js';

const router = Router();

// Ruta para el registro de usuarios
router.post('/register', registerValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    await register(req, res);
});

// Ruta para el inicio de sesión de usuarios
router.post('/login', loginValidation, async (req, res) => {
    const errors = validationResult
    (req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    await login(req, res);
});

export {router as authRoutes}