import { Entry } from "../model/Entry.js";
import { User } from "../model/User.js";

// Crear una nueva entrada
export const createEntry = async (req, res) => {
    try {
        const { userId } = req.body;

        // Verificar si el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Crear la entrada
        const newEntry = new Entry({ userId });
        await newEntry.save();

        res.status(201).json({ message: 'Entrada registrada exitosamente', entry: newEntry });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar la entrada', error: error.message });
    }
};

// Registrar salida
export const registerExit = async (req, res) => {
    try {
        const { entryId } = req.body;

        // Buscar la entrada
        const entry = await Entry.findById(entryId);
        if (!entry) {
            return res.status(404).json({ message: 'Entrada no encontrada' });
        }

        // Actualizar la hora de salida
        entry.exitTime = new Date();
        await entry.save();

        res.status(200).json({ message: 'Salida registrada exitosamente', entry });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar la salida', error: error.message });
    }
};

// Obtener todas las entradas
export const getEntries = async (req, res) => {
    try {
        const entries = await Entry.find();
        res.status(200).json(entries);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las entradas', error });
    }
};

// Obtener una entrada por ID
export const getEntryById = async (req, res) => {
    try {
        const { id } = req.params;
        const entry = await Entry.findById(id);
        if (!entry) {
            return res.status(404).json({ message: 'Entrada no encontrada' });
        }
        res.status(200).json(entry);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la entrada', error });
    }
};

// Consultar entradas y salidas en un intervalo de tiempo
export const getEntriesInRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Validar las fechas
        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Se requieren las fechas de inicio y fin' });
        }

        // Convertir las fechas a objetos Date
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Asegurarse de que la fecha de fin es después de la fecha de inicio
        if (end < start) {
            return res.status(400).json({ message: 'La fecha de fin debe ser después de la fecha de inicio' });
        }

        // Buscar entradas y salidas en el rango de fechas
        const entries = await Entry.find({
            entryTime: { $gte: start, $lte: end }
        });

        res.status(200).json(entries);
    } catch (error) {
        res.status(500).json({ message: 'Error al consultar las entradas y salidas', error: error.message });
    }
};