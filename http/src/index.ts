// import dotenv from 'dotenv';
// dotenv.config();
import express from 'express';
import cors from 'cors';
import adminRouter from './routes/admin';
import userRouter from './routes/user';
import courseRouter from './routes/course';

const app = express();

app.use(express.json());
app.use(cors(
    // {
    //     origin: ["http://localhost:3000"],
    //     methods: ["GET", "POST", "PUT", "DELETE"],
    //     credentials: true,
    // }
));

// logger middleware
app.use((req,res,next) =>{
    console.log(req.method,req.hostname, req.path);
    next();
});

app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/course", courseRouter)

const PORT = 8787;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});