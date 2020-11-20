const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

router.post("/registrar", (req, res, next) => {
  if (req.body.email !== undefined) {
    User.find({ email: req.body.email }).then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Email já existe",
        });
      } else {
        if (req.body.senha === undefined) {
          return res.status(500).json({
            mensagem: "É necessário o campo senha",
          });
        }
        bcrypt.hash(req.body.senha, 10, (err, hash) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              erro: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              senha: hash,
            });
            User.create(user)
              .then((result) => {
                res.status(201).json({
                  mensagem: "Usuario criado com sucesso",
                  usuario: result.email,
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  mensagem: "Não foi possivel criar o usuario",
                  erro: err,
                });
              });
          }
        });
      }
    });
  } else {
    return res.status(500).json({
      mensagem: "É necessário o campo email",
    });
  }
});

router.post("/entrar", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user === null) {
        return res.status(404).json({
          mensagem: "email não encontrado",
        });
      } else {
        bcrypt.compare(req.body.senha, user.senha, (err, result) => {
          if (err) {
            return res.status(500).json({
              mensagem: "Erro na autenticação",
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                email: user.email,
                userId: user._id,
              },
              process.env.JWT_KEY,
              {
                  expiresIn: "1h"
              }
            );
            return res.status(200).json({
              mensagem: "Autenticação bem sucedida",
              token: token
            });
          } else {
            return res.status(401).json({
              mensagem: "senha invalida",
            });
          }
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
