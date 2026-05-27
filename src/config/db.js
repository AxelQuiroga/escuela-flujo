import mongoose from "mongoose";
import { logger } from "../utils/logger.js";


export const connectDB = async() => {
    try {
        const dbURI = process.env.MONGODB_URI
        await mongoose.connect(dbURI);
        logger.info("Mongo db conectado");
    } catch (error) {
        logger.fatal(error, "Error al conectar con MongoDB");
        process.exit(1);
    }
}
