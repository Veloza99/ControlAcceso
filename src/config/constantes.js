import dotenv from 'dotenv';
dotenv.config()


export const DATABASE = process.env.DATABASE;

export const PORT = process.env.PORT;

export const JWT_SECRET = process.env.JWT_SECRET;

// ROLES
export const ESTUDIANTE = process.env.ESTUDIANTE
export const DOCENTE = process.env.DOCENTE;
export const ADMINISTRATIVO = process.env.ADMINISTRATIVO
export const VIGILANTE = process.env.VIGILANTE
export const VISITANTE = process.env.VISITANTE
export const ADMIN = process.env.ADMIN

