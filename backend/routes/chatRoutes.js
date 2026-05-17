import express from "express";
import {
  createChat,
  getChats,
  sendMessage,
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/new", protect, createChat);
router.get("/", protect, getChats);
router.post("/", protect, sendMessage);

export default router;