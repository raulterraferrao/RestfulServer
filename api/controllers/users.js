const User = require("../models/user");
const jwt =  require('jsonwebtoken')

const handleRegisterErrors = (err) => {
  //console.log(err.message, err.code);
  let errors = { email: "", senha: "" };

  //duplicate error code
  if (err.code === 11000) {
    errors.email = "Email já registrado";
    return errors;
  }

  //incorrect email
  if(err.message === "email incorreto"){
    errors.email = "Este email não está registrado"
    return errors;
  }
  //incorrect password
  if(err.message === "A senha está incorreta"){
    errors.senha = err.message;
    return errors;
  }

  //validation errors
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      console.log(properties);
      errors[properties.path] = properties.message;
    });
    return errors;
  }
};

exports.user_login = async (req, res, next) => {
  const { email, senha } = req.body;

  try {
    const user = await User.login(email, senha);
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "1h",
      }
    );
    res.cookie("jwt", token, { maxAge: 1000 * 60 * 60 });
    res.status(200).json({
      message: "Usuario logado com sucesso",
      user: user._id
    });
  } catch(err) {
    console.log(err)
    const errors = handleRegisterErrors(err);
    res.status(400).json({
      err: {
        message: errors,
      },
    });
  }
};

exports.user_signup = async (req, res, next) => {
  const user = new User({
    email: req.body.email,
    senha: req.body.senha,
  });

  try {
    await user.save();
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "1h",
      }
    );
    res.cookie("jwt", token, { maxAge: 1000 * 60 * 60 });
    res.status(200).json({
      message: "Usuario criado com sucesso",
      user: user._id
    });
  } catch (err) {
    const errors = handleRegisterErrors(err);
    res.status(400).json({
      err: {
        message: errors,
      },
    });
  }
};

exports.user_logout = async (req, res, next) => {
  
    res.cookie("jwt", '', { maxAge: 1 });
    res.status(200).json({
      message: "Usuario deslogado com sucesso",
    });
};


// User.findOne({ email: req.body.email })
// .then((user) => {
//   if (user === null) {
//     return res.status(404).json({
//       mensagem: "email não encontrado",
//     });
//   } else {
//     bcrypt.compare(req.body.senha, user.senha, (err, result) => {
//       if (err) {
//         return res.status(500).json({
//           mensagem: "Erro na autenticação",
//         });
//       }
//       if (result) {
//         const token = jwt.sign(
//           {
//             email: user.email,
//             userId: user._id,
//           },
//           process.env.JWT_KEY,
//           {
//             expiresIn: "1h",
//           }
//         );
//         res.cookie('jwt', token, { maxAge: 1000 * 60 * 60 });
//         return res.status(200).json({
//           mensagem: "Autenticação bem sucedida",
//           token: token
//         });
//       } else {
//         return res.status(401).json({
//           mensagem: "senha invalida",
//         });
//       }
//     });
//   }
// })
// .catch((err) => {
//   console.log(err);
//   res.status(500).json({
//     erro: err,
//   });
// });
