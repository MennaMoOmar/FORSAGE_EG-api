/* imports */
const mongoose = require("mongoose");

/* schema */
const schema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  category: {
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
  brandImage: {
    type: Buffer,
  },
});

//return specific data
schema.methods.toJSON = function () {
  const post = this;
  const postObject = post.toObject();
  delete postObject.__v;
  delete postObject.image;
  return postObject;
};

const Product = mongoose.model("Product", schema);

module.exports = Product;
