const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authControllers = require('../controllers/auth');
const User = require('../models/user');
const isAuth = require('../middleware/is-auth');

router.put(
	'/signup',
	[
		body('email')
			.isEmail()
			.withMessage('Please enter a valid email.')
			.custom((value, { req }) => {
				return User.findOne({ email: value }).then((userDoc) => {
					if (userDoc) {
						return Promise.reject('E-mail address already exists!');
					}
				});
			})
			.normalizeEmail()
			.trim(),
		body('password', 'Password length has to be more than 5 characters')
			.trim()
			.isLength({ min: 5 })
			.matches(/^(?=.*[A-Z])(?=.*[!@#$&*])/)
			.withMessage(
				'Password must contain at least one uppercase letter and one special character.'
			),
		body('repeatPassword', 'Passwords do not match.').custom(
			(value, { req }) => {
				if (value !== req.body.password) {
					return Promise.reject('Passwords has to be the same');
				}
				return true;
			}
		),
		body('name', `Name field can not be empty`).trim().not().isEmpty(),
		body('isChecked').toBoolean(),
	],
	authControllers.signup
);

router.post(
	'/login',
	[
		body('email').isEmail().withMessage('Please enter a valid email.'),
		body('password', 'This field cannot be empty').trim().not().isEmpty(),
	],
	authControllers.login
);
router.patch('/change', isAuth, authControllers.changeData);

module.exports = router;
