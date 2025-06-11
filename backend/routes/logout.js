// routes/logout.js
import { Router } from "express";
import { logout } from "../controllers/logout.js";

const router = Router();

// POST  /api/logout
router.post("/", logout);

export default router; // ← default export **router**
