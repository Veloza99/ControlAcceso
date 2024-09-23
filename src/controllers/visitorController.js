import { Visitor } from '../model/Visitor.js';
import { Entry } from "../model/Entry.js";


export const createVisitor = async (req, res) => {
    try {
        const { firstName, lastName, documentType, documentNumber, birthDate, motivoVisita } = req.body;
        const newVisitor = new Visitor({ firstName, lastName, documentType, documentNumber, birthDate});
        await newVisitor.save();

        const visitor = await Visitor.findOne({ documentNumber });
        if (!visitor) {
            return res.status(404).json({ message: 'Visitante no encontrado' });
        }

        const newEntry = new Entry({ visitorId: visitor._id });
        newEntry.motivoVisita = motivoVisita;
        newEntry.status = 'Pendiente de salida';
        newEntry.entryTime = Date.now();
        await newEntry.save();

        res.status(201).json({ message: 'Visitante creado exitosamente', visitor: newVisitor });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el visitante', error: error.message });
    }
};
