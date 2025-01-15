import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import userRouter from './routes/user';
import courseRouter from './routes/course';
import courseProgressRouter from './routes/courseProgress';
import purchaseRouter from './routes/purchase';

const app = express();

app.use(express.json());
app.use(cors(
    {
        origin: [process.env.CLIENT_URL || "http://localhost:3000"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }
));

// logger middleware
app.use((req,res,next) =>{
    console.log(req.method,req.hostname, req.path);
    next();
});

// app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/course", courseRouter)
app.use("/api/v1/progress", courseProgressRouter);
app.use("/api/v1/purchase", purchaseRouter);


const PORT = process.env.PORT || 8787;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});