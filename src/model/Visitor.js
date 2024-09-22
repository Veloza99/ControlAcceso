import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    documentType: { type: String, required: true },
    documentNumber: { type: String, required: true, unique: true },
    motivoVisita: { type: String, required: true },
    birthDate: { type: Date, required: true }
}, { timestamps: true });

export const Visitor = mongoose.model('Visitor', visitorSchema);
