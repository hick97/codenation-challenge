const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', require('./routes/routes'));

//setando engine de view
app.set('view engine', 'ejs');

const port = process.env.PORT || 3001;

app.listen(port, err =>{
    if(err)
        console.log('Error');
    else
        console.log('Server is running on port 3001');
});