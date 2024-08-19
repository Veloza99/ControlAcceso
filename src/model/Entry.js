import mongoose from "mongoose";

// Define el esquema para las entradas y salidas
const entrySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    entryTime: { type: Date, default: null },
    exitTime: { type: Date, default: null },
    duration: { type: Number }, // Duración en minutos
    status: { 
        type: String,
        enum: [
            'Pendiente de salida',
            'Exitoso',
            'Sin entrada',
            'Sin salida'
        ]
    }
}, { timestamps: true });

// Middleware pre-save para calcular la duración
entrySchema.pre('save', function (next) {
    if (this.entryTime && this.exitTime) {
        const durationInMs = this.exitTime - this.entryTime;
        this.duration = Math.floor(durationInMs / (1000 * 60));
        this.status = 'Exitoso';
    } else {
        this.duration = null;
    }
    next();
});

// Modelo de Entrada
export const Entry = mongoose.model('Entry', entrySchema);