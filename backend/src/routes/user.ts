import { Request, Response } from "express";
const express = require("express");
const user = express.Router();
const User = require("../models/User");

user.get("/", (req: Request, res: Response) => {
  res.send("hello");
});

user.post("/signup", async (req: Request, res: Response) => {
  try {
    const { id, email, password } = await req.body;
    if (!email || !password) {
      res.status(400).send("Invalid Data");
      return;
    }
    const new_user = new User({
      email,
      password,
    });
    await new_user.save();
    res.send(user);
  } catch (error: any) {
    return res.send(error.message);
  }
});

user.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.send("Invalid Data");
      return;
    }
    const exUser = await User.findOne({ email, password });
    if (!exUser) {
      return res.send("User not found");
    }
    return res.send(exUser);
  } catch (error: any) {
    return res.send(error.message);
  }
});

export default user;
