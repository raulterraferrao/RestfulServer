const jwt =  require('jsonwebtoken')

module.exports = (req, res, next) =>{
    const token = req.cookies.jwt;
    
    // check json web token exists and is verified

    if(token){
        const decoded = jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.status(400).json({
                    error: err.message
                })
                //res.redirect('/api/usuarios/entrar');
            }else{
                console.log(decodedToken);
                next();
            }
        });
    }else{
        //res.redirect('/api/usuarios/entrar');
        res.status(303).json({
            message: "Usuário não está logado, redirecione para a pagina de login"
        });
    }

};