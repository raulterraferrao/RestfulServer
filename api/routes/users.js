const express = require("express");
const router = express.Router();


const User = require("../models/user");
const { restart } = require("nodemon");


const UsersController = require('../controllers/users')

router.post("/entrar", UsersController.user_login);
router.post("/registrar", UsersController.user_signup);
router.post("/sair", UsersController.user_logout);


router.delete("/:email", (req, res, next) => {
  User.deleteOne({ email: req.params.email })
    .then((user) => {
      if (user.deletedCount === 0) {
        res.status(404).json({
          mensagem: "Não há usuarios com esse email",
        });
      } else {
        res.status(200).json({
          message:
            "O usuário com o email:  " + req.params.email + " foi deletado",
        });
      }
    })
    .catch();
});

module.exports = router;
