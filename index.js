const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const authRoutes = require('./router/auth');

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, PATCH, DELETE'
	);
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});
app.use('/auth', authRoutes);
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
