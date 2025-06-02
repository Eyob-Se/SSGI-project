import express from "express"; //

const router = express.Router();
import { login, loginLimiter } from "../controllers/login.js";

// router1.route('/')
// .post(logincontroller.login)
router.post("/", /* loginLimiter */ login);

export default router;
