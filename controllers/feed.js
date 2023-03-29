const fs = require('fs');
const path = require('path');
const User = require('../models/user');
const Product = require('../models/product');
const { default: mongoose } = require('mongoose');
const multer = require('multer');
const upload = multer({ dest: '/uploads/' });

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
	const imageUrl = req.file.path;
	const name = req.body.name;
	const category = req.body.category;
	const price = req.body.price;
	const description = req.body.description;
	const userId = req.body.userId;

	try {
		const product = new Product({
			_id: new mongoose.Types.ObjectId(),
			name: name,
			price: price,
			description: description,
			category: category,
			creator: userId,
			imageUrl: imageUrl,
		});
		const result = await product.save();
		res.status(200).json({ message: 'product has been created', data: result });
	} catch (err) {
		if (!err) {
			err.statusCode = 500;
		}
		next(err);
	}
};
