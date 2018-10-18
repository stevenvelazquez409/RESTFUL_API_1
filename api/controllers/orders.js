const Order = require('../models/order');
const mongoose = require('mongoose');

//exporting Controllers for Order verb routes
exports.orders_get_all = (req,res) => {
 Order.find()
 .select('_id product quantity')
 .populate('product', 'name')
 .exec()
 .then(data => {
   res.status(200).json({
     count: data.length,
     orders: data.map(order => {
       return {
         _id: order._id,
         quantity: order.quantity,
         request: {
           type: 'GET',
           url: 'http://localhost:3000/orders/' + order._id
         }
       }
     })
   });
 })
 .catch(err => {
   res.status(500).json({
     error: err
   })
 });
};
exports.orders_post =  (req,res) => {
  Product.findById(req.body.productId)
    .then(
      product => {
        if(!product) {
          return res.status(404).json({
            message: 'Product not found'
          })
        }
        const order = new Order({
          _id: new mongoose.Types.ObjectId(),
          quantity: req.body.quantity,
          product: req.body.productId
        });
        return order.save()
        .then(data => {
          console.log(data);
          res.status(201).json({
            message: 'Order submitted successfully',
            createdOrder: data,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/orders/' + data._id
            }
          });
        })
      })
    .catch(err => {
      res.status(500).json({
        message: 'Product not found',
        error: err
      })
    });
};
exports.order_get_id = (req,res) => {
  const id = req.params.orderId;
  Order.findById(id)
    .populate('product')
    .exec()
    .then(data => {
      if(!data) {
        res.status(404).json({
          message: 'No order found'
        });
      }
      res.status(200).json({
        _id: data._id,
        product: data.product,
        quantity: data.quantity,
        request: {
          type: 'GET',
          description: 'Request all orders',
          url: 'http://localhost:3000/orders'
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
exports.order_delete = (req,res) => {
  const id = req.params.orderId;
  Order.remove({_id: id})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Order deleted successfully',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/orders',
          body: { productId: 'ID', quantity: 'Number'}
        }
      });
    })
    .catch(err => {
      res.status(500).json({error: err});
    });
  res.status(200).json({message: 'deleted order'});
};
