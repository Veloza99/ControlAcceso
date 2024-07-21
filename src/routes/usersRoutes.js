import { Router } from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { validationResult } from 'express-validator';
import {userValidation} from "./validadores.js";

const router = Router();

// Ruta para conseguir todos los usuarios
router.get('/', getAllUsers);

// Ruta para buscar los usuarios por Id
router.get('/:id', getUserById);

// Ruta para actualizar los datos del usuario por id
router.put('/:id', userValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    await updateUser(req, res);
});

// Eliminar usuario por id
router.delete('/:id', deleteUser);

export {router as usersRoutes}