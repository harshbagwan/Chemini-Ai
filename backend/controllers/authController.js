import User from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";

export const register = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.create({ email, password });
  generateToken(res, user._id);

  res.json(user);
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(400).json({ msg: "Invalid credentials" });
  }

  generateToken(res, user._id);
  res.json(user);
};