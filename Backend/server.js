import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.js";
import leadRoutes from "./routes/lead.js";
import mediatorRoutes from "./routes/mediator.js";
import authRoutes from "./routes/auth.js";
import locationRoutes from "./routes/location.js";
import accessRoutes from "./routes/access.js";
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/mediators", mediatorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/access", accessRoutes);
app.get("/", (req, res) => {
  res.send("Casagrand Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
