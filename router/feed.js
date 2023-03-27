const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feed');

router.get('/user/:userId', feedController.getUser);

module.exports = router;
