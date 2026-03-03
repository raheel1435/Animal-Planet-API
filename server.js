import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import imageRoutes from "./routes/images.js";

const app = express();
const PORT = 3000;

const MONGO_URL = "mongodb://127.0.0.1:27017";
const DB_NAME = "imageDB";

const client = new MongoClient(MONGO_URL);

export let db;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Start Server
async function startServer() {
    try {
        await client.connect();
        db = client.db(DB_NAME);
        console.log("MongoDB connected");

        // Mount routes
        app.use("/api/images", imageRoutes);

        // 404 handler (for unmatched routes)
        app.use((req, res) => {
            res.status(404).json({ message: "Route not found" });
        });

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error("Server startup error:", err);
        process.exit(1);
    }
}

startServer();