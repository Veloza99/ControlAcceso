import { Entry } from "../model/Entry.js";
import { User } from "../model/User.js";
import { Visitor } from "../model/Visitor.js";

import { parseISO, startOfDay, endOfDay } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';




// Crear una nueva entrada
export const createEntry = async (req, res) => {
    try {
        const { identificacion } = req.body;

        // Verificar si el usuario existe
        const user = await User.findOne({ identificacion });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Obtener la fecha actual para el día
        const today = new Date().toISOString().split('T')[0];

        // Buscar la última entrada del usuario para el día actual
        const lastEntry = await Entry.findOne({ userId: user._id })
            .sort({ entryTime: -1 });

        // Actualizar la última entrada si no tiene hora de salida
        if (lastEntry && !lastEntry.exitTime) {
            lastEntry.status = 'Sin salida';
            await lastEntry.save();
        }

        // Crear la nueva entrada
        const newEntry = new Entry({ userId: user._id });
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
        const { identificacion } = req.body;

        // Verificar si el usuario existe
        const user = await User.findOne({ identificacion });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Buscar la última entrada del usuario
        const lastEntry = await Entry.findOne({ userId: user._id })
            .sort({ entryTime: -1 });

        // Si no hay entradas previas, crear una nueva entrada con estado "Sin entrada"
        if (!lastEntry) {
            const newEntry = new Entry({
                userId: user._id,
                exitTime: new Date(),
                status: 'Sin entrada'
            });
            await newEntry.save();
            return res.status(201).json({ message: 'Entrada creada con estado "Sin entrada"', entry: newEntry });
        }

        // Si la última entrada ya tiene una hora de salida, crear una nueva entrada con estado "Sin entrada"
        if (lastEntry.exitTime) {
            const newEntry = new Entry({
                userId: user._id,
                exitTime: new Date(),
                status: 'Sin entrada'
            });
            await newEntry.save();
            return res.status(201).json({ message: 'Entrada creada con estado "Sin entrada"', entry: newEntry });
        }

        // Verificar si la entrada es del mismo día
        const entryDate = lastEntry.entryTime.toISOString().split('T')[0];

        // Obtener la fecha actual para el día
        const today = new Date().toISOString().split('T')[0];

        if (entryDate === today) {
            // Actualizar la hora de salida y estado a "Exitoso"
            lastEntry.exitTime = new Date();
            lastEntry.status = 'Exitoso';
            await lastEntry.save();
            return res.status(200).json({ message: 'Salida registrada exitosamente', entry: lastEntry });
        } else {
            // Crear una nueva entrada con la hora de salida y estado "Sin entrada"
            const newEntry = new Entry({
                userId: user._id,
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
        const entries = await Entry.find({ userId: user._id }).sort({ updatedAt: -1 });

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


// Consultar entradas y salidas en un intervalo de tiempo
export const getAllEntries = async (req, res) => {
    try {
        const { fecha } = req.query;

        if (!fecha) {
            return res.status(400).json({ message: 'Se requiere una fecha.' });
        }

        // Definir la zona horaria del usuario (ajusta según tu ubicación)
        const userTimeZone = 'America/Bogota'; // Cambia esto a tu zona horaria

        // Parsear la fecha proporcionada (asumiendo formato 'YYYY-MM-DD')
        const date = parseISO(fecha);
        if (isNaN(date)) {
            return res.status(400).json({ message: 'Fecha inválida.' });
        }

        // Obtener el inicio y fin del día en la zona horaria del usuario
        const startOfDayInTimeZone = startOfDay(date);
        const endOfDayInTimeZone = endOfDay(date);

        // Convertir las fechas de inicio y fin del día a UTC
        const startDateUTC = fromZonedTime(startOfDayInTimeZone, userTimeZone);
        const endDateUTC = fromZonedTime(endOfDayInTimeZone, userTimeZone);

        // Consulta a la base de datos utilizando las fechas en UTC
        const entries = await Entry.find({
            entryTime: {
                $gte: startDateUTC,
                $lte: endDateUTC,
            },
        })
            .populate('userId')
            .populate('visitorId');

        res.status(200).json(entries);
    } catch (error) {
        console.error('Error al obtener las entradas:', error);
        res.status(500).json({ message: 'Error al obtener las entradas.' });
    }
};

// VISITANTES
export const registerVisitorEntry = async (req, res) => {
    try {
        const { documentNumber, motivoVisita } = req.body;

        const visitor = await Visitor.findOne({ documentNumber });
        if (!visitor) {
            return res.status(404).json({ message: 'Visitante no encontrado' });
        }

        // Buscar la última entrada del usuario para el día actual
        const lastEntry = await Entry.findOne({ visitorId: visitor._id })
            .sort({ entryTime: -1 });

        // Actualizar la última entrada si no tiene hora de salida
        if (lastEntry && !lastEntry.exitTime) {
            lastEntry.status = 'Sin salida';
            await lastEntry.save();
        }

        const newEntry = new Entry({ visitorId: visitor._id });

        console.log("entrada " + newEntry);

        newEntry.motivoVisita = motivoVisita;

        console.log("entrada 2" + newEntry);

        newEntry.status = 'Pendiente de salida';
        newEntry.entryTime = Date.now();
        await newEntry.save();

        res.status(201).json({ message: 'Entrada registrada exitosamente para el visitante', entry: newEntry });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar la entrada', error: error.message });
    }
};

export const registerVisitorExit = async (req, res) => {
    try {
        const { documentNumber } = req.body;

        // Verificar si el usuario existe
        const visitor = await Visitor.findOne( {documentNumber} );
        if (!visitor) {
            return res.status(404).json({ message: 'Visitante no encontrado' });
        }

        // Buscar la última entrada del usuario
        const lastEntry = await Entry.findOne({ visitorId: visitor._id })
            .sort({ entryTime: -1 });

        // Si no hay entradas previas, crear una nueva entrada con estado "Sin entrada"
        if (!lastEntry) {
            const newEntry = new Entry({
                visitorId: visitor._id,
                exitTime: new Date(),
                status: 'Sin entrada'
            });
            await newEntry.save();
            return res.status(201).json({ message: 'Entrada creada con estado "Sin entrada"', entry: newEntry });
        }

        // Si la última entrada ya tiene una hora de salida, crear una nueva entrada con estado "Sin entrada"
        if (lastEntry.exitTime) {
            const newEntry = new Entry({
                visitorId: visitor._id,
                exitTime: new Date(),
                status: 'Sin entrada'
            });
            await newEntry.save();
            return res.status(201).json({ message: 'Entrada creada con estado "Sin entrada"', entry: newEntry });
        }

        // Verificar si la entrada es del mismo día
        const entryDate = lastEntry.entryTime.toISOString().split('T')[0];

        // Obtener la fecha actual para el día
        const today = new Date().toISOString().split('T')[0];

        if (entryDate === today) {
            // Actualizar la hora de salida y estado a "Exitoso"
            lastEntry.exitTime = new Date();
            lastEntry.status = 'Exitoso';
            await lastEntry.save();
            return res.status(200).json({ message: 'Salida registrada exitosamente', entry: lastEntry });
        } else {
            // Crear una nueva entrada con la hora de salida y estado "Sin entrada"
            const newEntry = new Entry({
                visitorId: visitor._id,
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

export const getVisitorEntries = async (req, res) => {
    try {
        const { documentNumber } = req.params;

        const visitor = await Visitor.findOne({ documentNumber });
        if (!visitor) {
            return res.status(404).json({ message: 'Visitante no encontrado' });
        }

        const entries = await Entry.find({ visitorId: visitor._id }).sort({ entryTime: -1 });

        res.status(200).json(entries);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el historial de entradas del visitante', error: error.message });
    }
};

export const getVisitorsPendingExit = async (req, res) => {
    try {
        // Buscar todas las entradas que están pendientes de salida
        const allEntries = await Entry.find({ status: 'Pendiente de salida' })
            .populate('visitorId', 'firstName lastName documentType documentNumber'); // Asegúrate de poblar el campo visitorId con la información del visitante

        if (allEntries.length === 0) {
            return res.status(404).json({ message: 'No se encontraron entradas de visitantes en estado Pendiente de salida' });
        }

        //console.log('allEntries', allEntries)
        // Filtrar y formatear los datos
        const formattedEntries = allEntries.map(entry => {
            const {visitorId} = entry;
            const today = new Date().toISOString().split('T')[0];
            const todayEntry = entry.entryTime.toISOString().split('T')[0];
            if(visitorId !== undefined && (today==todayEntry)) {
                return {
                    visitorId: entry.visitorId._id.toString(),
                    entryTime: entry.entryTime,
                    motivoVisita: entry.motivoVisita,
                    status: entry.status,
                    visitor: {
                        firstName: entry.visitorId.firstName,
                        lastName: entry.visitorId.lastName,
                        documentType: entry.visitorId.documentType,
                        documentNumber: entry.visitorId.documentNumber,
                    }
                }
            }
        });

        const filteredEntries = formattedEntries.filter(entry => entry !== undefined);

        res.status(200).json(filteredEntries);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error al obtener las entradas de visitantes', error: error.message });
    }
};
