const express = require('express');
const router = express.Router();
const checkAuth = require('../middle/check-auth');
const OrdersController = require('../controllers/orders');

router.get('/', checkAuth, OrdersController.orders_get_all);
router.post('/', checkAuth, OrdersController.orders_post);
router.get('/:orderId', checkAuth, OrdersController.order_get_id);
router.delete('/:orderId', checkAuth, OrdersController.order_delete);

module.exports = router;
