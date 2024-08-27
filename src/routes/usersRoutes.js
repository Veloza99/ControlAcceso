import { Router } from 'express';
import { getAllUsers, getUserById, updateUser, updateUserProfilePic, deleteUser } from '../controllers/userController.js';
import { validationResult } from 'express-validator';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import {ADMIN } from "../config/constantes.js";
import { authorize } from '../middlewares/authorizeMiddleware.js';
import {uploadImages} from "../middlewares/upload.js";
import {userValidation} from "../validator/validadores.js";


const router = Router();

// Ruta para conseguir todos los usuarios
router.get('/', authenticateToken, authorize([ADMIN]), getAllUsers);

// Ruta para buscar los usuarios por Id
router.get('/:identificacion', authenticateToken, authorize([ADMIN]), getUserById);

// Ruta para actualizar los datos del usuario por id
router.put('/:id', authenticateToken, authorize([ADMIN]), uploadImages.single('picProfile'), userValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    await updateUser(req, res);
});

// Ruta para actualizar solo la imagen de perfil del usuario
router.put('/:id/picProfile', authenticateToken, authorize([ADMIN]), uploadImages.single('picProfile'), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    await updateUserProfilePic(req, res);
});


// Eliminar usuario por id
router.delete('/:id', authenticateToken, authorize([ADMIN]), deleteUser);

export {router as usersRoutes}