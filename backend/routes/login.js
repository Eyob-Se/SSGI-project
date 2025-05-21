import express from "express"; //

const router1 = express.Router();
import logincontroller from "../controllers/login.js";

// router1.route('/')
// .post(logincontroller.login)
router1.post("/", logincontroller.loginLimiter, logincontroller.login);

export default router1;
