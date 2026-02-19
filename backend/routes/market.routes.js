// routes/market.routes.js

import express from "express";
import { getKlines } from "../controllers/market.controller.js";

const router = express.Router();

router.get("/klines", getKlines);

export default router;
