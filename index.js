import express from "express";
import session from "express-session";
import "dotenv/config";
import cors from "cors";
import passport from "./config/passport/index.js";

import apiV1Router from "./routes/apiV1Router.js";
import connectDatabase from "./database/dbConnection.js";

// configs
const app = express();
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
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