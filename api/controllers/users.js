const User = require("../models/user");

exports.user_login = async (req, res, next) => {

  const {email, senha} = req.body;

  try{
    const user =  await User.login(email,senha);
    res.status(200).json(user)   
  }catch{
    res.status(500).json({
      error: 'an error ocurred'
    })
  }
}


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
