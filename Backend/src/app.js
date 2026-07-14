import "dotenv/config";

import express from "express";
import { createServer } from "node:http";

import { Server } from "socket.io";

import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";

import cors from "cors";
import userRoutes from "./routers/users.routes.js";

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
const allowedOrigins = frontendUrl
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const app = express();
const server = createServer(app);
const io = connectToSocket(server, allowedOrigins);

app.set("port", (process.env.PORT || 8000));
app.use(cors({ origin: allowedOrigins, credentials: false }));
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users",userRoutes);

app.get("/home", (req, res) => {
    return res.json({"hello": "World"})
});

app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
        return res.status(400).json({
            message: "Invalid JSON body. In Thunder Client, choose JSON body and remove any extra quotes around the whole payload.",
        });
    }

    return next(error);
});

const start = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI is not set");
        }

        const connectionDb = await mongoose.connect(mongoUri);

        console.log(`MONGO Connected DB Host: ${connectionDb.connection.host}`);
        server.listen(app.get("port"), () => {
            console.log("LISTENING ON PORT 8000");
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

start();