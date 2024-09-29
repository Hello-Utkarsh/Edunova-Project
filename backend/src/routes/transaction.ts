import { Request, Response } from "express";
import Transaction from "../models/Transaction";
import Book from "../models/Book";
import jwt from "jsonwebtoken";
const express = require("express");
const transaction = express.Router();

// return book
transaction.get("/return", async (req: Request, res: Response) => {
  try {
    const { id } = req.headers;
    if (!id) {
      return res.send("Invalid Data").status(400);
    }
    const update_transc = await Transaction.findByIdAndUpdate(id, {
      returnDate: Date.now(),
    });
    if (!update_transc) {
      return res.send("Not Found");
    }
    const days = Math.round(
      (Date.now() - new Date(update_transc.issueDate).getTime()) /
        (1000 * 3600 * 24)
    );
    const book = await Book.findOne({ name: update_transc.book });
    if (!book) {
      return res.json({message: "Not Found"});
    }
    const rent = book?.rent;
    // if the user return the book same day, they'll have to pay 1 day rent price
    const totalRent = (days == 0 ? 1 : days) * rent;
    return res.json({message: 'success', update_transc, totalRent });
  } catch (error: any) {
    return res.json({message: error.message});
  }
});

// issue book
transaction.post("/issue", async (req: Request, res: Response) => {
  try {
    const { book } = req.body;
    const authToken = req.headers.authorization;
    if (!book || !authToken) {
      return res.json({ message: "Invalid Data" });
    }
    const isIssued = await Transaction.find({ book: book });
    if (
      isIssued.length > 0 &&
      isIssued[isIssued.length - 1].returnDate == null
    ) {
      return res.json({
        message: `Sorry the book is currently issued by ${
          isIssued[isIssued.length - 1].user
        }`,
      });
    }
    const secret = process.env.JWT_SECRET || "";
    const user: any = jwt.verify(authToken, secret);
    const new_transc = new Transaction({
      book,
      user: user.name,
      issueDate: Date.now(),
      returnDate: null,
    });
    await new_transc.save();
    return res.json({ message: "Successfully Issued" });
  } catch (error: any) {
    return res.json({ message: error.message });
  }
});

// book details: no of people issued, currently available or not, currently issued by whom
transaction.get("/bookTrans", async (req: Request, res: Response) => {
  try {
    const { name } = req.headers;
    if (!name) {
      return res.send("Invalid Data");
    }
    const trans = await Transaction.find({ book: name });

    // if available is not empty it means the book is issued by someone and not available currently
    const available = trans.find((x: any) => x.returnDate == null) ? false : true;
    const currently_issued_by =
      trans.find((x: any) => x.returnDate == null)?.user || "none";
    res.send({
      no_of_people_issued: trans.length,
      available,
      currently_issued_by,
    });
  } catch (error: any) {
    return res.send(error.message);
  }
});

// total rent generated by the book
transaction.get("/rentGen", async (req: Request, res: Response) => {
  try {
    const { name } = req.headers;
    if (!name) {
      return res.send("Invalid Data");
    }
    const trans = await Transaction.find({ book: name });
    const book = await Book.findOne({ name });
    let total_rent = 0;

    // for each transaction, calculating the rent generated
    trans.map((x: any) => {
      const days = Math.round(
        (Date.now() - new Date(x.issueDate).getTime()) / (1000 * 3600 * 24)
      );
      if (book) {
        const rent = book?.rent;
        total_rent += (days == 0 ? 1 : days) * rent;
        return;
      }
    });
    return res.send({ total_rent: total_rent });
  } catch (error: any) {
    return res.send(error.message);
  }
});

// all the books issued by the person
transaction.get("/issuedbookbypeopl", async (req: Request, res: Response) => {
  try {
    const authToken = req.headers.authorization;
    if (!authToken) {
      return res.json({ message: "Please login/signup" });
    }
    const secret = process.env.JWT_SECRET || "";
    const user: any = jwt.verify(authToken, secret);
    if (!user) {
      return res.send("Invalid Data").status(400);
    }
    const trans = await Transaction.find({ user: user.name });
    const bookIssued: {book: string, id: string}[] = [];
    trans.map((x: any) => bookIssued.push({book: x.book, id: x.id}));
    return res.json({message: 'success', books: bookIssued});
  } catch (error: any) {
    return res.json({message: error.message});
  }
});

transaction.post("/bookbydate", async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.body;
    if (!startDate || !endDate) {
      return res.send("Invalid Data");
    }
    const trans = await Transaction.find({
      issueDate: {
        $gte: new Date(startDate).getTime(),
        $lte: new Date(endDate).getTime(),
      },
    });
    if (!trans) {
      return res.send("No Transaction were made during the time");
    }
    const data: { book: string; user: string }[] = [];
    trans.map((val: any) => {
      data.push({ book: val.book, user: val.user });
    });
    return res.send(data);
  } catch (error: any) {
    return res.send(error.message);
  }
});

export default transaction;
