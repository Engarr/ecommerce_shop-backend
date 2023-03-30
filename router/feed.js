const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feed');

router.get('/user/:userId', feedController.getUser);
router.post('/add-product', feedController.postAddProduct);
router.get('/products', feedController.getProducts);
router.get('/products/:category', feedController.getCategoryProducts);

module.exports = router;
