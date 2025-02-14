import express from 'express';
import authRoutes from './src/routes/auth.routes.js';
import dotenv from "dotenv";
import { connectDB } from './src/lib/db.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



connectDB();

app.listen(PORT, () => {
    console.log("server is running on port:" + PORT);
});