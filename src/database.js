import dotenv from 'dotenv';
dotenv.config()

import mongoose from "mongoose";
import {DATABASE} from "./config/constantes.js";
import {User} from "./model/User.js";


export const connectDB = async () => {
    try {
        await mongoose.connect(DATABASE);
        console.log("Base de datos conectada");

        const admin = await User.findOne({email:process.env.ADMIN_EMAIL})
        if (!admin){
            const newAdmin = new User({
                firstName:process.env.ADMIN_FIRST,
                lastName:process.env.ADMIN_LAST,
                identificacion:process.env.ADMIN_IDENTIFICACION,
                email:process.env.ADMIN_EMAIL,
                password:process.env.ADMIN_PASS,
                role:process.env.ADMIN});
            await newAdmin.save();
            console.log('admin creado');
        }

    } catch (error) {
        console.error(error);
        process.exit(1);
    }

}
