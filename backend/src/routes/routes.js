const express = require('express');
const router = express.Router();
const path = require('path');

const decryptController = require('../controllers/decrypt');

//Routes

router.get('/decrypt', decryptController.decrypt);

router.get('/download', (req, res)=>{
    res.download(path.join(__dirname, '..', '..', 'answer.json')); // Set disposition and send it.
});

module.exports = router;