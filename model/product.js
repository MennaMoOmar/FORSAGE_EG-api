/* imports */
const mongoose = require("mongoose");

/* schema */
const schema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  code: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  productImage: {
    type: Buffer,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Category",
  },
});

//return specific data
schema.methods.toJSON = function () {
  const product = this;
  const productObject = product.toObject();
  delete productObject.__v;
  delete productObject.productImage;
  return productObject;
};

const Product = mongoose.model("Product", schema);

module.exports = Product;
