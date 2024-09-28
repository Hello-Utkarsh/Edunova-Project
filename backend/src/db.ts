const mongoose = require("mongoose");

export default async function ConnectToDB(){
  await mongoose
    .connect(
      "mongodb+srv://Utkarsh:xy3792971@cluster0.mr3ul.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(console.log("Connected"))
    .catch((err: any) => console.log(err));
};