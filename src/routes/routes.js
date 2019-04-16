const express = require('express');
const router = express.Router();
const decryptController = require('../controllers/decrypt');
const submitController = require('../controllers/submit');


//Routes
router.get('/', (req, res)=>{
    res.redirect('/submit');
});

router.get('/decrypt', decryptController.decrypt);

router.get('/submit', submitController.submit);

module.exports = router;