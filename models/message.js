import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema({
  title: {
    type: String,
    maxLength: 100,
    required: true,
  },
  body: {
    type: String,
    maxLength: 500,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
    required: true,
  }
});

MessageSchema.virtual("days_passed").get(function() {
  return Math.floor((Date.now() - this.date.getTime()) / (1000 * 60 * 60 * 24)) + "d";
});

export default mongoose.model("Message", MessageSchema);
