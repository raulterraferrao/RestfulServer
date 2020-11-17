const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Order.find()
    .select("_id produtoMongoId quantidade")
    .populate("produtoMongoId")
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  const id = req.body.produtoMongoId;
  Product.findById(id)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          mensagem:
            "É necessário colocar o_id de um produto válido para fazer o pedido",
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantidade: req.body.quantidade,
        produtoMongoId: req.body.produtoMongoId,
      });
      return Order.create(order);
    })
    .then((result) => {
      if (res.statusCode === 404) {
        return res;
      }
      res.status(201).json({
        mensagem: "pedido criado",
        pedidoCriado: {
          _id: result._id,
          produto: result.produtoMongoId,
          quantidade: result.quantidade,
        },
      });
    })
    .catch((err) => {
      res.status(500).json(err);
      console.log(err);
    });
});

router.get("/:orderId", (req, res, next) => {
  Order.findById(req.params.orderId).select("_id produtoMongoId quantidade").populate("produtoMongoId")
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          mensagem: "É necessário colocar o_id de um pedido válido",
        });
      }
      res.status(200).json({
        pedido: order,
      });
    })
    .catch((err) => {
      res.status(500).json({
        erro: err,
      });
    });
});

router.post("/:orderId", (req, res, next) => {
  res.status(201).json({
    message: "You create an order",
  });
});

router.patch("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: "You updated a product",
  });
});

router.delete("/:orderId", (req, res, next) => {
  const _id = req.params.orderId;
  Order.deleteOne({ _id: _id })
    .then((result) => {
      if (result.deletedCount === 0) {
        res.status(404).json({
          message: "Não existe pedido com esse_id",
        });
      } else {
        res.status(200).json({
          message: "O pedido com o id : " + _id + " foi deletado",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        erro: err,
      });
    });
});

module.exports = router;
