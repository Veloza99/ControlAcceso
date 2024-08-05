import jwt from 'jsonwebtoken';
import {ADMINISTRATIVO, DOCENTE, ESTUDIANTE, JWT_SECRET, VIGILANTE, VISITANTE} from "../config/constantes.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import { User } from "../model/User.js";

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Función para eliminar una imagen
const deleteImage = (filename) => {
    const imagePath = join(__dirname, '../../static/images', filename);
    if (fs.existsSync(imagePath)) {
        try {
            fs.unlinkSync(imagePath);
            console.log(`Imagen eliminada: ${imagePath}`);
        } catch (error) {
            console.error(`Error al eliminar la imagen ${imagePath}:`, error);
        }
    } else {
        console.log(`La imagen no existe: ${imagePath}`);
    }
};

// Función de registro
export const register = async (req, res) => {
    try {
        const { firstName, lastName, identificacion, email, password, role } = req.body;
        const picProfile = req.file ? req.file.filename : '';

        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ $or: [{ email }, { identificacion }] });
        if (userExists) {
            if (picProfile) {
                deleteImage(picProfile);
            }
            return res.status(400).json({ message: "El usuario ya existe" });
        }

        // Verificar si el rol es válido
        if (![DOCENTE, ESTUDIANTE, ADMINISTRATIVO, VISITANTE, VIGILANTE].includes(role)) {
            if (picProfile) {
                deleteImage(picProfile);
            }
            return res.status(400).json({ message: "Rol no válido" });
        }

        // Crear nuevo usuario
        const newUser = new User({
            firstName,
            lastName,
            identificacion,
            email,
            password,
            role,
            picProfile: picProfile || null
        });

        // Guardar usuario en la base de datos
        await newUser.save();

        // Generar token JWT
        const token = jwt.sign({
            userId: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            identificacion: newUser.identificacion,
            email: newUser.email,
            role: newUser.role,
            picProfile: newUser.picProfile,
            active: newUser.active
        }, JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ message: 'Usuario registrado exitosamente', token });
    } catch (error) {
        if (req.file) {
            deleteImage(req.file.filename);
        }
        res.status(500).json({ message: 'Error en el registro', error: error.message });
    }
};

// Función de inicio de sesión
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar si el usuario existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        // Comparar contraseña
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generar token JWT
        const token = jwt.sign({
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            identificacion: user.identificacion,
            email: user.email,
            role: user.role,
            picProfile: user.picProfile,
            active: user.active
        }, JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        res.status(500).json({ message: 'Error en el inicio de sesión', error: error.message });
    }
};
