const mongoose = require("mongoose");
const empSchema = new mongoose.Schema({
 
  fname: {
    type: String,
  },
  lname: {
    type: String,
  },
  email: { type: String, required: true,unique: true },
  password:{type:String},
  address: { type: String},
  designation: { type: String},
  salary: { type: Number},
 
  date: { type: Date, default: Date.now },
});
module.exports = mongoose.model("employee", empSchema);
