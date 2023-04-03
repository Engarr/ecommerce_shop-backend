const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

router.get('/user/:userId', feedController.getUser);
router.post('/add-product', feedController.postAddProduct);
router.get('/products', feedController.getProducts);
router.get('/products/:category', feedController.getCategoryProducts);
router.get('/:productId', feedController.getProduct);
router.put('/product/:productId', feedController.editProduct);
router.delete('/product/:productId', isAuth, feedController.deleteProduct);

module.exports = router;
