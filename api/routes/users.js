const express = require('express');
const router = express.Router();
const UserController = require('../controllers/users');
const checkAuth = require('../middleware/checkAuth');

router.post('/signup', UserController.create_user);
router.post('/login', UserController.login_user);
router.delete('/:userId', checkAuth, UserController.delete_user);

module.exports = router;
