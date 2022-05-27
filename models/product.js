const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Product", productSchema);

productSchema.pre("save", function(next) {
  // capitalize
  this.title.charAt(0).toUpperCase() + this.title.slice(1);
  next();
});
