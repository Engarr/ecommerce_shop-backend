const User = require('../models/user');

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
	} catch (err) {}
};
