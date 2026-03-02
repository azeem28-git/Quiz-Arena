const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  username:String,
  category:String,
  score:Number,
  percentage:Number,
  date:{ type:Date, default:Date.now }
});

module.exports = mongoose.model("Score", scoreSchema);