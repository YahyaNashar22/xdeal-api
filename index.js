import express from "express";
import "dotenv/config";
import cors from "cors";

import apiV1Router from "./routes/apiV1Router.js";
import connectDatabase from "./database/dbConnection.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(
    cors({
        origin: "*",
        credentials: true,
        optionsSuccessStatus: 200
    })
);


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