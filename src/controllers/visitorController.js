import { Visitor } from '../model/Visitor.js';


export const createVisitor = async (req, res) => {
    try {
        const { firstName, lastName, documentType, documentNumber, birthDate } = req.body;

        const newVisitor = new Visitor({ firstName, lastName, documentType, documentNumber, birthDate });
        await newVisitor.save();

        res.status(201).json({ message: 'Visitante creado exitosamente', visitor: newVisitor });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el visitante', error: error.message });
    }
};
