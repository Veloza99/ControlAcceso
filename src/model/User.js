import mongoose from "mongoose";
import {ADMIN, ADMINISTRATIVO, DOCENTE, ESTUDIANTE, VIGILANTE, VISITANTE} from "../config/constantes.js";
import bcrypt from "bcryptjs";


const usuarioSchema = new mongoose.Schema({
    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    identificacion: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    picProfile: { type: String, required: false},
    role: { type: String, enum: [ADMIN, ESTUDIANTE, DOCENTE, ADMINISTRATIVO,VIGILANTE ,VISITANTE], required: true},
    active: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
}, { timestamps: true});

// Middleware pre-save para cifrar la contraseña
usuarioSchema.pre("save", async function (next) {
    // Solo se hace hash a la contraseña si ha sido modificada o es nueva
    if(!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (e) {
        next(e);
    }
});

// Método para comparar contraseñas
usuarioSchema.methods.comparePassword = async function (password) {
    try {
        // Comparar las contraseñas almacenada con la que proporciona el usuario
        return await bcrypt.compare(password, this.password);
    } catch (e) {
        throw e;
    }
}


export const User = mongoose.model('User', usuarioSchema);