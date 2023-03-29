const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const multer = require('multer');

const feedRoutes = require('./router/feed');
const authRoutes = require('./router/auth');

const app = express();
const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'images');
	},
	filename: (req, file, cb) => {
		cb(null, uuidv4());
	},
});
const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg'
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

app.use(cors());
app.use(bodyParser.json());
app.use(
	multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, PATCH, DELETE'
	);
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});
app.use(express.static('images'));
app.use('/auth', authRoutes);
app.use('/feed', feedRoutes);
app.use((error, req, res, next) => {
	console.log(error);
	const status = error.satusCode || 500;
	const message = error.message;
	const data = error.data;
	res.status(status).json({ message: message, data: data });
});

mongoose
	.connect(
		`mongodb+srv://Lukasz:${process.env.MOONGOSE_PASS}@cluster0.k4a8s6m.mongodb.net/ecommers?retryWrites=true`
	)
	.then((result) => {
		app.listen(8080);
		console.log('server is running');
	})
	.catch((err) => {
		console.log(err);
	});
