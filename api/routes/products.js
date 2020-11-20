const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const checkAuth = require('../middleware/check-auth')

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads/");
  },
  filename: function (req, file, callback) {
    callback(null, new Date() + file.originalname);
  },
});

const fileFilter = (req, file, callback) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    callback(null, true);
  } else {
    //reject a file
    callback(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter
});

const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Product.find()
    .select("idSistema nome descricao marca preco estoque embalagem")
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", checkAuth, upload.single("produtoImg"), (req, res, next) => {
  const product =  new Product(
    req.body
  );

  product.save(product)
    .then((result) => {
      res.status(200).json(result);
      console.log(result);
    })
    .catch((err) => {
      res.status(500).json(err);
      console.log(err);
    });
});
router.post("/uploadImg",checkAuth, upload.single("produtoImg"), (req, res, next) => {
  console.log(req.file);
  console.log("posted");
  res.status(200).json({
    mensagem: "Imagem enviada",
  });
});
router.post("/allproducts", (req, res, next) => {
  console.log(req);
  Product.insertMany(req.body)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) =>
      res.status(500).json({
        error: err,
      })
    );
});

router.get("/:idMongo", (req, res, next) => {
  const _id = req.params.idMongo;
  Product.find({
    _id: _id,
  })
    .then((doc) => {
      console.log("the doc is " + doc);
      if (Object.entries(doc).length !== 0) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "No valid entry found for entry id" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.patch("/:idMongo", (req, res, next) => {
  const _id = req.params.idMongo;
  Product.updateOne({ _id: _id }, req.body)
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.delete("/:idMongo", (req, res, next) => {
  const _id = req.params.idMongo;
  Product.deleteOne({ _id: _id })
    .then((result) => {
      if (result.deletedCount === 0) {
        res.status(404).json({
          message: "There is no product with such id",
        });
      } else {
        res.status(200).json({
          message: "The object with the id " + _id + " has been deleted",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
