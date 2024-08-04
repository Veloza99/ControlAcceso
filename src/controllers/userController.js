import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { User } from '../model/User.js';

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Función para eliminar imágenes
const deleteImages = (images) => {
    images.forEach(image => {
        const imagePath = join(__dirname, '../../static/images', image);
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
    });
};

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
    }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
    }
};

// Actualizar un usuario
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, identificacion, email, role } = req.body;

        // Manejar la actualización de la imagen de perfil
        let picProfile = undefined;
        if (req.file) {
            const user = await User.findById(id);
            if (user.picProfile) {
                deleteImages([user.picProfile]);
            }
            picProfile = req.file.filename;
        }

        const updatedFields = {};
        if (firstName !== undefined) updatedFields.firstName = firstName;
        if (lastName !== undefined) updatedFields.lastName = lastName;
        if (identificacion !== undefined) updatedFields.identificacion = identificacion;
        if (email !== undefined) updatedFields.email = email;
        if (role !== undefined) updatedFields.role = role;
        if (picProfile !== undefined) updatedFields.picProfile = picProfile;

        const user = await User.findByIdAndUpdate(id, updatedFields, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
    }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Eliminar la imagen de perfil del usuario
        if (user.picProfile) {
            deleteImages([user.picProfile]);
        }

        res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
    }
};
