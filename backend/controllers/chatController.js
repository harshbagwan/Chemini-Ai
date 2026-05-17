import Chat from "../models/chatModel.js";
import { callGemini } from "../utils/geminiClient.js";

export const createChat = async (req, res) => {
  const chat = await Chat.create({
    user: req.user._id,
    title: "New Chat",
    messages: [],
  });

  res.json(chat);
};

export const getChats = async (req, res) => {
  const chats = await Chat.find({ user: req.user._id });
  res.json(chats);
};

export const sendMessage = async (req, res) => {
  const { chatId, message } = req.body;

  const chat = await Chat.findById(chatId);

  chat.messages.push({ role: "user", content: message });

  const reply = await callGemini(chat.messages);

  chat.messages.push({ role: "model", content: reply });

  await chat.save();

  res.json({ reply, chat });
};