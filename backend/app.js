import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDb from './config/connectdb.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const port = process.env.PORT || 8000;
const DATABASE_URL = process.env.DATABASE_URL;

app.use(cors());
connectDb(DATABASE_URL);
app.use(express.json());
app.use("/api/user", userRoutes);
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
