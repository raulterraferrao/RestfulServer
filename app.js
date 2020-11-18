// express aplication

const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

mongoose.connect(

    process.env.DB_ATLAS_URI,
  
     { 
      useNewUrlParser: true, 
      useUnifiedTopology: true ,
      useCreateIndex: true
    }
  
  ).then().catch(err => console.log(err));


const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users')

app.use(morgan('dev')); //log the incoming request
app.use(express.static('public')) // make the public folder acessible from the url ex: localhost:3000/images/1.jpg
app.use(express.urlencoded({extended: false,limit: '50mb'}));
app.use(express.json({limit: '50mb'}));
app.use(cors());
//Router which should handle request
app.use('/api/produtos', productRoutes);
app.use('/api/pedidos', orderRoutes);
app.use('/api/usuarios', userRoutes)

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500 );
    res.json({
        error: {
            message : error.message
        }
    });
}); 

module.exports = app;
