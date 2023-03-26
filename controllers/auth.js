const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.signup = async (req, res, next) => {
	console.log(req);
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
