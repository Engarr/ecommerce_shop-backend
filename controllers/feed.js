const User = require('../models/user');
const Product = require('../models/product');

exports.getUser = async (req, res, next) => {
	const userId = req.params.userId;
	try {
		const user = await User.findById(userId);

		if (!user) {
			const error = new Error('Could not find user');
			error.statusCode = 422;
			throw error;
		}
		res.status(200).json({ message: 'user fetched', userData: user });
	} catch (err) {
		if (!err) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.postAddProduct = async (req, res, next) => {
	const name = req.body.name;
	const category = req.body.category;
	const price = req.body.price;
	const description = req.body.description;
	const userId = req.body.userId;

	try {
		const product = new Product({
			name: name,
			price: price,
			description: description,
			category: category,
			creator: userId,
		});
		await product.save();
		res.status(200).json({ message: 'product has been created' });
	} catch (err) {
		if (!err) {
			err.statusCode = 500;
		}
		next(err);
	}
};
