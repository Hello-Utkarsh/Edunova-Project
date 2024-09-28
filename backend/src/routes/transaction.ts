import { Request, Response } from "express";
import Transaction from "../models/Transaction";
import Book from "../models/Book";
const express = require("express");
const transaction = express.Router();

// return book
transaction.post("/return", async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
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
      return res.send("Not Found");
    }
    const rent = book?.rent;
    // if the user return the book same day, they'll have to pay 1 day rent price
    const totalRent = (days == 0 ? 1 : days) * rent;
    return res.send({ update_transc, totalRent });
  } catch (error: any) {
    return res.send(error.message);
  }
});

// issue book
transaction.post("/issue", async (req: Request, res: Response) => {
  try {
    const { book, user } = req.body;
    if (!book || !user) {
      return res.send("Invalid Data");
    }
    const new_transc = new Transaction({
      book,
      user,
      issueDate: Date.now(),
      returnDate: null,
    });
    await new_transc.save();
    return res.send(new_transc);
  } catch (error: any) {
    return res.send(error.message);
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
    const available = trans.find((x) => x.returnDate == null) ? false : true;
    const currently_issued_by =
      trans.find((x) => x.returnDate == null)?.user || "none";
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
    trans.map((x) => {
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
    const { name } = req.headers;
    if (!name) {
      return res.send("Invalid Data").status(400);
    }
    const trans = await Transaction.find({ user: name });
    const bookIssued: string[] = [];
    trans.map((x) => bookIssued.push(x.book));
    return res.send(bookIssued);
  } catch (error: any) {
    return res.send(error.message);
  }
});

export default transaction;
