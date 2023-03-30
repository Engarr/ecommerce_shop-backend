const fs = require('fs');
const path = require('path');
const User = require('../models/user');
const Product = require('../models/product');
const { default: mongoose } = require('mongoose');

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
	if (!req.file) {
		const error = new Error('No image provided.');
		error.statusCode = 422;
		throw error;
	}
	const imageUrl = req.file.path.replace('\\', '/');
	const name = req.body.name;
	const category = req.body.category;
	const price = req.body.price;
	const description = req.body.description;
	const userId = req.body.userId;

	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: name,
		price: price,
		description: description,
		category: category,
		creator: userId,
		imageUrl: imageUrl,
	});
	try {
		const result = await product.save();
		const user = await User.findById(userId);
		user.products.push(product._id);
		await user.save();
		res.status(200).json({ message: 'product has been created', data: result });
	} catch (err) {
		if (!err) {
			err.statusCode = 500;
		}
		next(err);
	}
};
