import app from "./app.js";
import { connectDB } from "./config/db.js";
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 8067

export const startServer = async () => {
    try {
        await connectDB();

        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        server.on("error", (err) => {
            console.error("Server error:", err);
        });

    } catch (error) {
        console.error("Startup failed:", error);
        process.exit(1);
    }
};
startServer();