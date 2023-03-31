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
		const userProductsId = user.products;
		const products = await Product.find({ _id: { $in: userProductsId } });

		res
			.status(200)
			.json({ message: 'user fetched', userData: user, products: products });
	} catch (err) {
		if (!err) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.postAddProduct = async (req, res, next) => {
	const images = req.files;
	console.log(images);
	if (!images || images.length === 0) {
		const error = new Error('No images provided.');
		error.statusCode = 422;
		throw error;
	}
	const imagePaths = images.map((image) => image.path.replace('\\', '/'));
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
		imageUrl: imagePaths,
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

exports.getProducts = async (req, res, next) => {
	try {
		const products = await Product.find();
		res
			.status(200)
			.json({ message: 'Fetched products successfully.', products: products });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.getCategoryProducts = async (req, res, next) => {
	const category = req.params.category;

	try {
		const products = await Product.find({ category: category });
		res
			.status(200)
			.json({ message: 'Fetched products successfully.', products: products });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.getProduct = async (req, res, next) => {
	const productId = req.params.productId;
	try {
		const product = await Product.findById(productId);
		res
			.status(200)
			.json({ message: 'Fetched product successfully.', product: product });
	} catch (err) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};
