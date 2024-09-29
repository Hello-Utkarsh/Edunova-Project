import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const express = require("express");
const user = express.Router();
const salt = 10;

user.get("/getalluser", (req: Request, res: Response) => {
  const allUsers = User.find();
  res.send(allUsers);
});

user.post("/signup", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = await req.body;
    if (!name || !email || !password) {
      res.status(400).json({ message: "Invalid Data" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, salt);
    const new_user = new User({
      name,
      email,
      password: hashedPassword,
    });
    const secret = process.env.JWT_SECRET || "";
    const authtoken = jwt.sign(
      { name: new_user.name, email: new_user.email },
      secret
    );
    await new_user.save();
    res.json({ message: "success", authtoken });
  } catch (error: any) {
    return res.json({ message: error.message });
  }
});

user.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.json({ message: "Invalid Data" });
      return;
    }
    const exUser = await User.findOne({ email });
    if (!exUser) {
      return res.send("User not found");
    }
    const check = await bcrypt.compare(password, exUser.password);
    if (!check) {
      return res.status(401).json({ message: "Incorrect Password" });
    }
    const secret = process.env.JWT_SECRET || "";
    const authtoken = jwt.sign(
      { name: exUser.name, email: exUser.email },
      secret
    );
    return res.json({ message: "success", authtoken }).status(200);
  } catch (error: any) {
    return res.json({ message: error.message });
  }
});

export default user;
