import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import ruangKerjaRoutes from "./routes/ruangKerjaRoutes.js";
import bangunanRoutes from "./routes/bangunanRoutes.js";
import asesmenRoutes from "./routes/asesmenRoutes.js";

const app = express();
const port = process.env.PORT || 5454;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: true, // untuk izinkan semua origin selama development
  credentials: true
}));

// Routes
app.get('/', (req, res) => res.send("API Working ✅"));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use("/api/ruangkerja", ruangKerjaRoutes);
app.use("/api/bangunan", bangunanRoutes);
app.use("/api/asesmen", asesmenRoutes);

// Start server
app.listen(port, () => console.log(`🚀 Server started on PORT: ${port}`));
