const mongoose = require("mongoose");

export default async function ConnectToDB(){
  await mongoose
    .connect(process.env.MONGODB_CONNECTION_URL)
    .then(console.log("Connected"))
    .catch((err: any) => console.log(err));
};