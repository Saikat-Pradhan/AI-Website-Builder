import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import websiteRouter from "./routes/website.route.js";
import paymentRouter from "./routes/payment.route.js";
import cookieParser from "cookie-parser";
import cors from "cors"

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173", //"https://ai-website-builder-by-saikat-pradhan.onrender.com",
    credentials:true
}))

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/website", websiteRouter);
app.use("/api/payment", paymentRouter)

// Error handling
app.use((req, res) => {
  res.status(404).send("Route not found");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`);
  connectDB();
});
