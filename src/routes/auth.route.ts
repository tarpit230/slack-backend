import express from "express";
import { getAccessToken, login, signup } from "../controllers/authControllers.js";

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/get/access-token', getAccessToken)

export default router;

