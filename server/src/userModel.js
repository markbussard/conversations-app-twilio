import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('User', userSchema);
