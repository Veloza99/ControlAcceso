import { check } from 'express-validator';
import {ADMINISTRATIVO, DOCENTE, ESTUDIANTE, VIGILANTE, VISITANTE} from "../config/constantes.js";

// Validaciones para el registro de usuario
export const registerValidation = [
    check('firstName').notEmpty().withMessage('El nombre es requerido'),
    check('lastName').notEmpty().withMessage('El apellido es requerido'),
    check('identificacion').notEmpty().withMessage('La identificación es requerida'),
    check('email').isEmail().withMessage('Por favor ingresa un correo electrónico válido'),
    check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    check('role').isIn([ESTUDIANTE, DOCENTE, ADMINISTRATIVO, VIGILANTE, VISITANTE]).withMessage('Rol inválido'),
];

// Validaciones para el inicio de sesión de usuario
export const loginValidation = [
    check('email').isEmail().withMessage('Por favor ingresa un correo electrónico válido'),
    check('password').notEmpty().withMessage('La contraseña es requerida'),
];