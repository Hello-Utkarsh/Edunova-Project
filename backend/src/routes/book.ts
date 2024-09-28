import { Request, Response } from "express";
import Transaction from "../models/Transaction";
import Book from "../models/Book";
const express = require("express");
const book = express.Router();

// create book
book.post("/postBook", async (req: Request, res: Response) => {
  try {
    const { name, category, rent } = req.body;
    if (!name || !category || !rent) {
      return res.send("Invalid Data").status(400);
    }
    const new_book = new Book({
      name,
      category,
      rent,
    });
    await new_book.save();
    res.send(new_book);
  } catch (error: any) {
    return res.send(error.message);
  }
});

// search book
book.get("/getBook", async (req: Request, res: Response) => {
  try {
    const { name, gt, lt, category } = req.headers;
    const searchParam: any = {};
    if (name) {
      searchParam.name = { $regex: name };
    }
    if (gt || lt) {
      if (gt && lt) {
        searchParam.rent = { $lte: lt, $gte: gt };
      } else {
        if (!gt && lt) {
          searchParam.rent = { $lte: lt };
        }
        if (gt && !lt) {
          searchParam.rent = { $gte: gt };
        }
      }
    }
    if (category) {
      searchParam.category = category;
    }
    const found_book = await Book.find(searchParam);
    if (!found_book) {
      return res.send("Not Found");
    }
    return res.send(found_book);
  } catch (error: any) {
    return res.send(error.message);
  }
});

export default book;
