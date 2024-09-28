import mongoose from 'mongoose';
const { Schema } = mongoose;

const transactionSchema = new Schema({
  book: {type: String, required: true},
  user: {type: String, required: true},
  issueDate: {type: Date, required: true},
  returnDate: Date
});

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction