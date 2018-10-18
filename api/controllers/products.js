const mongoose = require('mongoose');
const Product = require(../models/product);

exports.get_all_products = (req,res,next) => {
  Product.find()
  .select('name price _id productImage')
  .exec()
  .then(docs => {
    const response = {
      count: docs.length,
      products: docs.map(doc => {
        return {
          name: doc.name,
          price: doc.price,
          productImage: doc.productImage,
          _id: doc._id,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products/' + doc._id
          }
        }
      })
    }
    res.status(200).json(response);
    })
  .catch(err => {
    console.error(err);
    res.status(500).json({
      error: err
    });
  });
}
exports.post_product = (req,res,next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });

  product.save()
  .then(data => {
    console.log(data);
    res.status(200).json({
      message: 'Created product successfully',
      createdProduct: {
        name: data.name,
        price: data.price,
        _id: data._id,
        request: {
          type: 'GET',
          url: 'http://localhost:3000/products/' + data._id
        }
      }});
    })
  .catch(err => {
    console.error(err);
    res.status(500).json({error: err});
  });
};
exports.get_productId = (req,res,next) => {
 const id = req.params.productId;
 Product.findById(id)
   .select('_id name price productImage')
   .exec()
   .then(doc => {
     console.log("From database ", doc);

     if(doc) {
       res.status(200).json({
         product: doc,
         request: {
           type: 'GET',
           description: 'GET all products with request',
           url: 'http://localhost:3000/products/'
         }
       });
     }else {
       res.status(404).json({message: "No valid entry found."})
     }
   })
   .catch(err => {
     console.error(err);
     res.status(500).json({error: err});
   });

}
exports.update_product = (req,res,next) => {
  const id = req.params.productId;
  const updateOps = {};
  for(const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({_id: id},{ $set: updateOps})
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'Product updated',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/products/' + id
        }
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: err
      });
    });
};
exports.delete_product = (req,res,next) => {
  const id = req.params.productId;
  Product.remove({_id: id})
    .exec()
    .then(result => {
      result.status(200).json({
        message: 'Product deleted',
        request: {
          type: 'POST',
          description: 'Post a new product',
          url: 'http://localhost:3000/products',
          body: {name: 'String', price: 'Number'}
        }
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: err
      });
    });

};
