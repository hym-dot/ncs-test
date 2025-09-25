import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import fileRoutes from './routes/files.js'; // 1. 파일 라우터 불러오기

const PORT = process.env.PORT;
await mongoose.connect(process.env.MONGO_URI);
const app = express();

app.use(cors({
    origin: process.env.FRONT_ORIGIN,
    credentials: true
}));

app.use(express.json());

// 2. '/api/files' 경로로 오는 모든 요청을 fileRoutes가 처리하도록 등록
app.use('/api/files', fileRoutes);

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});