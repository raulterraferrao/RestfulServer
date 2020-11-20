const Order = require("../models/order");

exports.orders_get_all = (req, res, next) => {
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
  }
