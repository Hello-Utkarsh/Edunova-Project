import ConnectToDB from "./db";
import user from "./routes/user";
import book from "./routes/book";
import { Request, Response } from "express";
import transaction from "./routes/transaction";
import cors from "cors";
import express from 'express';
const app = express();
const bodyParser = require("body-parser");
const port = 3000;

ConnectToDB();
app.use(bodyParser.json());
app.use(cors());

app.use("/user", user);
app.use("/book", book);
app.use("/transaction", transaction);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
