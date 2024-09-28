import mongoose from 'mongoose';
const { Schema } = mongoose;

const bookSchema = new Schema({
  name: {type: String, unique: true, required: true},
  category: {type: String, required: true},
  rent: {type: Number, required: true}
});

const Book = mongoose.model('Book', bookSchema);
export default Book