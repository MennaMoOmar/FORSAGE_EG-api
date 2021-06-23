/* imports npm */
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const multer = require("multer");
const sharp = require("sharp");

/* import models */
const Product = require("../model/product");

/* import middleware */
const checkRequiredParams = require("../middleware/checkRequired");
const validateRequest = require("../middleware/validateRequest");
const validateImage = require("../middleware/validationImage");

/* Routes */
//get all posts
// api/product
router.get("/", async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.send(products);
  } catch (err) {
    err.statusCode = 442;
    next(err);
  }
});

////////////////////////////////// Filter by categories ///////////////////////////////
router.get("/FORSAGE", async (req, res) => {
  try {
    const products = await Product.find({ category: "FORSAGE" }).exec();
    res.json(products);
  } catch (err) {
    res.status(422).send({
      error: err,
      statusCode: 422,
    });
  }
});

router.get("/Partner", async (req, res) => {
  try {
    const products = await Product.find({ category: "Partner" }).exec();
    res.json(products);
  } catch (err) {
    res.status(422).send({
      error: err,
      statusCode: 422,
    });
  }
});

router.get("/force", async (req, res) => {
  try {
    const products = await Product.find({ category: "force" }).exec();
    res.json(products);
  } catch (err) {
    res.status(422).send({
      error: err,
      statusCode: 422,
    });
  }
});

router.get("/rockforce", async (req, res) => {
  try {
    const products = await Product.find({ category: "rockforce" }).exec();
    res.json(products);
  } catch (err) {
    res.status(422).send({
      error: err,
      statusCode: 422,
    });
  }
});

router.get("/molot", async (req, res) => {
  try {
    const products = await Product.find({ category: "molot" }).exec();
    res.json(products);
  } catch (err) {
    res.status(422).send({
      error: err,
      statusCode: 422,
    });
  }
});

router.get("/toptul", async (req, res) => {
  try {
    const products = await Product.find({ category: "toptul" }).exec();
    res.json(products);
  } catch (err) {
    res.status(422).send({
      error: err,
      statusCode: 422,
    });
  }
});

router.get("/wmc", async (req, res) => {
  try {
    const products = await Product.find({ category: "wmc" }).exec();
    res.json(products);
  } catch (err) {
    res.status(422).send({
      error: err,
      statusCode: 422,
    });
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////

//get product by id
router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    res.send(product);
  } catch (err) {
    res.status(422).send({
      error: err,
      statusCode: 422,
    });
  }
});

//add product
router.post(
  "/addproduct",
  checkRequiredParams(["name", "category", "price", "code", "description"]),
  validateRequest([
    body("name").isLength({ min: 3, max: 20 }),
    body("category").isLength({ min: 3, max: 20 }),
  ]),
  async (req, res, next) => {
    const createdProduct = new Product({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      code: req.body.code,
      description: req.body.description,
    });
    const product = await createdProduct.save();
    res.status(200).send(product);
  }
);

//edit product
router.patch("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    let product = await Product.findById(id);
    await product
      .update({
        name: req.body.name || product.name,
        category: req.body.category || product.category,
        price: req.body.price || product.price,
        code: req.body.code || product.code,
        description: req.body.description || product.description,
      })
      .exec();
    res.status(200).send({ message: "product changed succesfuly" });
  } catch (err) {
    res.status(422).send({
      error: err,
      statusCode: 422,
    });
  }
});

//delete product
router.delete("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    await product.remove();
    res.status(200).send({ message: "product removed succesfuly" });
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
  "/productImg/:id",
  upload.single("productImage"),
  async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(422).send({
          error: "product not found",
          statusCode: 422,
        });
      }
      const buffer = await sharp(req.file.buffer).png().toBuffer();
      product.productImage = buffer;
      await product.save();
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

//add brandimage by id
router.post(
  "/brandImg/:id",
  upload.single("brandImage"),
  async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(422).send({
          error: "product not found",
          statusCode: 422,
        });
      }
      console.log("test");

      const buffer = await sharp(req.file.buffer).png().toBuffer();
      product.brandImage = buffer;
      await product.save();
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
router.get("/productImg/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.productImage) {
      return res.status(422).send({
        error: "product not found",
        statusCode: 422,
      });
    }
    res.set("Content-Type", "image/jpg");
    res.send(product.productImage);
  } catch (err) {
    res.status(400).send({
      error: err,
    });
  }
});

module.exports = router;
