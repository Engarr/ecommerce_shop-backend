const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

router.get('/user/:userId', feedController.getUser);
router.post(
	'/add-product',
	[
		body('name').notEmpty().withMessage('Product name can not be empty'),
		body('category', 'Please chose category').notEmpty(),
		body('price')
			.notEmpty()
			.withMessage('Price field cannot be empty')
			.isDecimal({ decimal_digits: '1,2' })
			.withMessage('Price field must be a number with up to 2 decimal places')
			.isFloat({ min: 0.01 })
			.withMessage('Price field must be a positive number'),
		body('description')
			.notEmpty()
			.withMessage('Descriptione can not be empty')
			.isLength({ max: 500 })
			.withMessage('Product description cannot be longer than 500 characters'),
	],
	feedController.postAddProduct
);
router.get('/products', feedController.getProducts);
router.get('/products/:category', feedController.getCategoryProducts);
router.get('/:productId', feedController.getProduct);
router.put('/product/:productId', feedController.editProduct);
router.delete('/product/:productId', isAuth, feedController.deleteProduct);

module.exports = router;
