import app from "./app.js";
import { connectDB } from "./config/db.js";
import { logger } from "./utils/logger.js";
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 8067

export const startServer = async () => {
    try {
        await connectDB();

        const server = app.listen(PORT, () => {
            logger.info({ port: PORT }, `Server running on port ${PORT}`);
        });

        server.on("error", (err) => {
            logger.error(err, "Server error");
        });

    } catch (error) {
        logger.fatal(error, "Startup failed");
        process.exit(1);
    }
};
startServer();