/* imports npm */
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const multer = require("multer");
const sharp = require("sharp");

/* import models */
const Category = require("../model/category");

/* import middleware */
const checkRequiredParams = require("../middleware/checkRequired");
const validateRequest = require("../middleware/validateRequest");
const validateImage = require("../middleware/validationImage");

/* Routes */
//get all categories
// api/category
router.get("/", async (req, res, next) => {
  try {
    const categories = await Category.find({});
    res.send(categories);
  } catch (err) {
    err.statusCode = 442;
    res.send("server error");
    // next(err);
  }
});

//get slice category
router.get("/slicecategories", async (req, res, next) => {
  try {
    const categories = await Category.find({});
    const slicecategories = categories.slice(0, 3);
    res.send(slicecategories);
  } catch (err) {
    err.statusCode = 442;
    next(err);
  }
});

//get category by id
router.get("/:id", async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    res.send(category);
  } catch (err) {
    res.status(422).send({
      error: err,
      statusCode: 422,
    });
  }
});

//add category
router.post(
  "/addcategory",
  checkRequiredParams(["name"]),
  validateRequest([body("name").isLength({ min: 3, max: 20 })]),
  async (req, res, next) => {
    try {
      const { name } = req.body;

      // check if admin exists
      const isExist = await Category.findOne({ name });
      if (isExist) {
        return res.status(400).json({ msg: " category already exists!!" });
      }
      const createdCategory = new Category({
        name,
      });
      const category = await createdCategory.save();
      res.status(200).send(category);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
);

//edit category name
router.patch("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    let category = await Category.findById(id);
    console.log(req.body);
    await Category.update({
      name: req.body.name || category.name,
    }).exec();
    res.status(200).send({ message: "category changed succesfuly" });
  } catch (err) {
    res.status(422).send({
      error: err,
      statusCode: 422,
    });
  }
});

//delete category
router.delete("/:id", async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    await category.remove();
    res.status(200).send({ message: "category removed succesfuly" });
  } catch (err) {
    res.status(422).send({
      error: err,
      statusCode: 422,
    });
  }
});

/* image */
const upload = multer({
  limits: {
    fileSize: 5000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|PNG|JPG)$/)) {
      return cb(new Error("please upload image"));
    }
    cb(undefined, true);
  },
});

//add image by id
router.post(
  "/categoryImg/:id",
  upload.single("categoryImage"),
  async (req, res, next) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(422).send({
          error: "category not found",
          statusCode: 422,
        });
      }
      const buffer = await sharp(req.file.buffer).png().toBuffer();
      category.categoryImage = buffer;
      await category.save();
      res.send({
        message: "image added successfully",
      });
    } catch (err) {
      res.status(400).send({
        error: err,
      });
    }
  },
  validateImage
);

//get image by id
router.get("/categoryImg/:id", async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category || !category.categoryImage) {
      return res.status(422).send({
        error: "category not found",
        statusCode: 422,
      });
    }
    res.set("Content-Type", "image/jpg");
    res.send(category.categoryImage);
  } catch (err) {
    res.status(400).send({
      error: err,
    });
  }
});

module.exports = router;
