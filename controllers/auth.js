const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.signup = async (req, res, next) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		return res.status(422).json({ errors: error.array() });
	}
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;
	const isChecked = req.body.isChecked;
	try {
		const hashedPassword = await bcrypt.hash(password, 12);
		const user = new User({
			name: name,
			email: email,
			password: hashedPassword,
			isChecked: isChecked,
		});
		const result = await user.save();
		res
			.status(201)
			.json({ message: 'User has been created', userId: result._id });
	} catch (err) {
		if (!err) {
			err.statusCode = 500;
		}
		next(err);
	}
};

exports.login = async (req, res, next) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		return res.status(422).json({ errors: error.array() });
	}
	const email = req.body.email;
	const password = req.body.password;
	let loadedUser;

	try {
		const user = await User.findOne({ email: email });
		if (!user) {
			const error = new Error('Could not find user with that email');
			error.statusCode = 401;
			throw error;
		}
		loadedUser = user;
		const isEqual = await bcrypt.compare(password, user.password);

		if (!isEqual) {
			const error = new Error('Wrong password!');
			error.statusCode = 401;
			throw error;
		}
		const token = jwt.sign(
			{
				email: loadedUser.email,
				userId: loadedUser._id.toString(),
				name: loadedUser.name,
			},
			process.env.SECRET_TOKEN,
			{ expiresIn: '1h' }
		);
		res.status(200).json({
			token: token,
			userId: loadedUser._id.toString(),
			name: loadedUser.name,
		});
	} catch (err) {
		if (!err) {
			err.statusCode = 500;
		}
		next(err);
	}
};
