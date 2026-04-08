import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRouter from './auth.js';

const app = express();
app.use(cors()); // your Vite dev URL
app.use(express.json());

app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Auth server running on http://localhost:${PORT}`));