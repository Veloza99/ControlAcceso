import express from "express";
import * as http from "node:http";
import {Server} from 'socket.io';
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import {authRoutes} from "./routes/authRoutes.js";
import {usersRoutes} from "./routes/usersRoutes.js";
import {entryRoutes} from "./routes/entryRoutes.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



// Importacion de los archivos de rutas


// Instancia de express
const app = express();


//configurar middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));



const server =http.createServer(app);
// Realizar comunicacion en timepo real

export const io = new Server(server, {});

// Usar y exponer rutas
app.use('/api/static', express.static(join(__dirname, '../static')));
app.use('/api/auth', authRoutes);
app.use('/api/user', usersRoutes);
app.use('/api/entry', entryRoutes);

export {server};

