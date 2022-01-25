import mongoose from "mongoose";

const messageppSchema = mongoose.Schema({
  message: String,
  name: String,
  timestamp: String,
  received: Boolean,
});

export default mongoose.model("messagecontents", messageppSchema);
