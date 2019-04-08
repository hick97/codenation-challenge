const express = require('express');
const router = express.Router();
const decryptController = require('../controllers/decrypt');

router.get('/decrypt', decryptController.decrypt);

router.get('/submit', decryptController.submit);

module.exports = router;