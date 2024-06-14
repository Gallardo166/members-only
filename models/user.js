import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  first_name: {
    type: String,
    maxLength: 100,
    required: true,
  },
  last_name: {
    type: String,
    maxLength: 100,
    required: true,
  },
  username: {
    type: String,
    maxLength: 100,
    required: true,
  },
  password: {
    type: String,
    minLength: 8,
    required: true,
  },
  status: {
    type: String,
    enum: ["guest", "user", "member", "admin"],
    required: true,
  },
});

export default mongoose.model("User", UserSchema);
