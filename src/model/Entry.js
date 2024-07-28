import mongoose from "mongoose";

// Define el esquema para las entradas y salidas
const entrySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    entryTime: { type: Date, default: Date.now, required: true },
    exitTime: { type: Date },
    duration: { type: Number } // Duración en minutos
}, { timestamps: true });

// Middleware pre-save para calcular la duración
entrySchema.pre("save", function (next) {
    if (this.exitTime) {
        const durationInMs = this.exitTime - this.entryTime;
        this.duration = Math.floor(durationInMs / (1000 * 60)); // Convertir a minutos
    }
    next();
});

// Modelo de Entrada
export const Entry = mongoose.model('Entry', entrySchema);