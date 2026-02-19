import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import marketRoutes from "./routes/market.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", marketRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({ message: "Backend Trading Platform rodando 🚀" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
