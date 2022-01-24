import mongoose from "mongoose";

const messageppSchema = mongoose.Schema({
  message: String,
  name: String,
  timestamp: String,
});

export default mongoose.model("messagecontent", messageppSchema);
