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

        // Obtener la fecha actual para el día
        const today = new Date().toISOString().split('T')[0];

        // Buscar la última entrada del usuario para el día actual
        const lastEntry = await Entry.findOne({ userId })
            .sort({ entryTime: -1 });

        // Actualizar la última entrada si no tiene hora de salida
        if (lastEntry && !lastEntry.exitTime) {
            lastEntry.status = 'Sin salida';
            await lastEntry.save();
        }

        // Crear la nueva entrada
        const newEntry = new Entry({ userId });
        newEntry.status = 'Pendiente de salida';
        newEntry.entryTime = Date.now();
        await newEntry.save();

        res.status(201).json({ message: 'Entrada registrada exitosamente', entry: newEntry });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar la entrada', error: error.message });
    }
};

// Registrar salida
export const registerExit = async (req, res) => {
    try {
        const { userId } = req.body;

        // Verificar si el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Obtener la fecha actual para el día
        const today = new Date().toISOString().split('T')[0];

        // Buscar la última entrada del usuario
        const lastEntry = await Entry.findOne({ userId })
            .sort({ entryTime: -1 });

        // Si no hay entradas previas, crear una nueva entrada con estado "Sin entrada"
        if (!lastEntry) {
            const newEntry = new Entry({
                userId,
                exitTime: new Date(),
                status: 'Sin entrada'
            });
            await newEntry.save();
            return res.status(201).json({ message: 'Entrada creada con estado "Sin entrada"', entry: newEntry });
        }

        // Si la última entrada ya tiene una hora de salida, crear una nueva entrada con estado "Sin entrada"
        if (lastEntry.exitTime) {
            const newEntry = new Entry({
                userId,
                exitTime: new Date(),
                status: 'Sin entrada'
            });
            await newEntry.save();
            return res.status(201).json({ message: 'Entrada creada con estado "Sin entrada"', entry: newEntry });
        }

        // Verificar si la entrada es del mismo día
        const entryDate = lastEntry.entryTime.toISOString().split('T')[0];

        if (entryDate === today) {
            // Actualizar la hora de salida y estado a "Exitoso"
            lastEntry.exitTime = new Date();
            lastEntry.status = 'Exitoso';
            await lastEntry.save();
            return res.status(200).json({ message: 'Salida registrada exitosamente', entry: lastEntry });
        } else {
            // Crear una nueva entrada con la hora de salida y estado "Sin entrada"
            const newEntry = new Entry({
                userId,
                exitTime: new Date(),
                status: 'Sin entrada'
            });
            await newEntry.save();
            return res.status(201).json({ message: 'Entrada creada con estado "Sin entrada"', entry: newEntry });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar la salida', error: error.message });
    }
};



// Obtener todas las entradas del usuario específico usando el documento
export const getEntries = async (req, res) => {
    try {
        const { identificacion } = req.params; // Asume que el identificador del usuario se pasa como parámetro de la ruta

        // Buscar el documento del usuario por su identificador
        const user = await User.findOne({ identificacion }); // Cambia { identificacion } por el campo que uses para identificar al usuario
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Obtener todas las entradas del usuario ordenadas por entryTime de manera descendente (más nuevas primero)
        const entries = await Entry.find({ userId: user._id }).sort({ entryTime: -1 });

        res.status(200).json(entries);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las entradas', error: error.message });
    }
};


// Obtener una entrada por ID
export const getEntryById = async (req, res) => {
    try {
        const { userId } = req.params;
        const entry = await Entry.findOne({ userId })
            .sort({ entryTime: -1 });
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