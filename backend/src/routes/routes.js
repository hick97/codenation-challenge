const express = require('express');
const router = express.Router();
const decryptController = require('../controllers/decrypt');



//Routes

router.get('/decrypt', decryptController.decrypt);

module.exports = router;