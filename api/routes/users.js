const express = require("express");
const router = express.Router();


const User = require("../models/user");
const { restart } = require("nodemon");


const UsersController = require('../controllers/users')

router.post("/entrar", UsersController.user_login);

const handleRegisterErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", senha: "" };

  //duplicate error code
  if(err.code === 11000){
    errors.email = 'Email já registrado'
    return errors;
  }

  //validation errors
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({properties}) => {
      console.log(properties);
      errors[properties.path] = properties.message
    });
    return errors;
  }
};

router.post("/registrar", async (req, res, next) => {
  const user = new User({
    email: req.body.email,
    senha: req.body.senha,
  });
  try {
    await user.save();
    res.status(200).json({
      message: "Usuario criado com sucesso",
    });
  } catch (err) {
    const errors = handleRegisterErrors(err);
    res.status(400).json({
      err: {
        message: errors,
      },
    });
  }
});


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
