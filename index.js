import express from "express";
import "dotenv/config";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import apiV1Router from "./routes/apiV1Router.js";
import connectDatabase from "./database/dbConnection.js";

// configs
const app = express();

// Required for ES modules (__dirname replacement)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());
app.use(
    cors({
        origin: "*",
        credentials: true,
        optionsSuccessStatus: 200
    })
);

// port
const port = process.env.PORT || 5000;

// routes
app.get('/server-status', (req, res) => res.send("live"));
app.use('/api/v1', apiV1Router);

// Connect to server
app.listen(process.env.PORT, (error) => {
    if (!error) {
        console.log(`Server Running On Port: ${port}`);
    } else {
        console.error(`Failed to connect to server: ${error}`);
    }
});

connectDatabase();