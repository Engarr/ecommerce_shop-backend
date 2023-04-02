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
exports.editProduct = async (req, res, next) => {
	const productId = req.params.productId;
	const name = req.body.name;
	const category = req.body.category;
	const price = req.body.price;
	const description = req.body.description;
	const userId = req.body.userId;
	let imagefilesPaths = [];
	let imagesFile;
	let newImages = [];
	let images = req.body.images;
	if (images) {
		newImages = images;
	}

	if (req.files) {
		imagesFile = req.files;
		imagefilesPaths = imagesFile.map((image) => image.path.replace('\\', '/'));
		if (images) {
			newImages = imagefilesPaths.concat(images);
		}
		newImages = imagefilesPaths;
	}

	try {
		if (!images && !imagesFile) {
			const error = new Error('No file picked.');
			error.statusCode = 422;
			throw error;
		}

		const product = await Product.findById(productId);
		if (!product) {
			const error = new Error('Could not find product.');
			error.statusCode = 404;
			throw error;
		}
		if (product.creator.toString() !== userId) {
			const error = new Error('Not authorized!');
			error.statusCode = 403;
			throw error;
		}

		for (let i = 0; i < product.imageUrl.length; i++) {
			if (newImages[i] !== product?.imageUrl[i]) {
				clearImage(product.imageUrl[i]);
			}
		}

		product.name = name;
		product.imageUrl = newImages;
		product.description = description;
		product.category = category;
		product.price = price;
		const result = await product.save();
		res.status(200).json({ message: 'Product updated!', product: result });
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

const clearImage = (filePath) => {
	filePath = path.join(__dirname, '..', filePath);
	fs.unlink(filePath, (err) => console.log(err));
};
