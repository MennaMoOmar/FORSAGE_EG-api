/* imports */
const mongoose = require("mongoose");

/* schema */
const schema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },

  categoryImage: {
    type: Buffer,
  },
});

//return specific data
schema.methods.toJSON = function () {
  const category = this;
  const categoryObject = category.toObject();
  delete categoryObject.__v;
  // delete categoryObject.categoryImage;
  return categoryObject;
};

const Category = mongoose.model("Category", schema);

module.exports = Category;
