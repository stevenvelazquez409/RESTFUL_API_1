const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

const password = process.env.MONGO_ATLAS_PW;
mongoose.connect(`mongodb://anglelock409:${password}@node-restapi-shard-00-00-cfclu.mongodb.net:27017,node-restapi-shard-00-01-cfclu.mongodb.net:27017,node-restapi-shard-00-02-cfclu.mongodb.net:27017/test?ssl=true&replicaSet=node-restapi-shard-0&authSource=admin&retryWrites=true`);

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req,res,next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, Accept, X-Requested-With, Authorization, Content-Type');

  if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, POST, PATCH');
    return res.status(200).json({});
  }
  next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

app.use((req,res,next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
