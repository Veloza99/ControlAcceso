import jwt from 'jsonwebtoken';
import { User } from "../model/User.js";

// Función de registro
export const register = async (req, res) => {
    try {
        const { firstName, lastName, identificacion, email, password, role, picProfile } = req.body;


        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ $or: [{ email }, { identificacion }] });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Crear nuevo usuario
        const newUser = new User({
            firstName,
            lastName,
            identificacion,
            email,
            password,
            role,
            picProfile: picProfile || 'default-profile-pic.jpg' // Imagen por defecto si no se proporciona
        });

        // Guardar usuario
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
