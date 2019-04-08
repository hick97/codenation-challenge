const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const sha1 = require('sha1');
const crypto = require('crypto'), shasum = crypto.createHash('sha1');
const fileName = '../../answer.json';
const file = require(fileName);

'use strict';

//FUNCTIONS
function creatJson(params = {}){
    let data = JSON.stringify(params);
 
    fs.writeFileSync('answer.json', data); 
}
function updateJSON(updatedValue, flag = 1){

    if(flag){
        file.decifrado = updatedValue;
    
        fs.writeFile(fileName, JSON.stringify(file), function (err) {
    
            if (err) return console.log(err);
    
            var updateFile = JSON.stringify(file);
    
            fs.writeFileSync('answer.json', updateFile);
        });
    }else{
        file.resumo_criptografico = updatedValue;
    
        fs.writeFile(fileName, JSON.stringify(file), function (err) {
    
            if (err) return console.log(err);
    
            var updateFile = JSON.stringify(file);
    
            fs.writeFileSync('answer.json', updateFile);
        });
    }

}

async function decrypt(encryptValue){

    var originalAlphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v','w', 'x', 'y', 'z'];
    var alphabet = originalAlphabet.reverse();

    var splitEncrypt = encryptValue.split('');

    //console.log(splitEncrypt);

    var result = '';

    for(var i = 0; i < splitEncrypt.length; i++){

        if(splitEncrypt[i].match(/[A-Z]/gi)){

            var newPosition = await ((alphabet.indexOf(splitEncrypt[i]) + 10) % alphabet.length);
            
            result = result + alphabet[newPosition];

        }else{
            result = result + splitEncrypt[i]; 
        }
    }
    //console.log(result);
    return result;
}

//METHODS
module.exports = {
    async decrypt(req, res){
        
        var result = await axios.get('https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token='+ process.env.CODENATION_TOKEN);
        
        await creatJson({
            numero_casas: result.data.numero_casas,
            token: result.data.token,
            cifrado: result.data.cifrado,
            decifrado: result.data.decifrado,
            resumo_criptografico: result.data.resumo_criptografico
        })
          
        var decryptValue = await decrypt(result.data.cifrado);
        await shasum.update(decryptValue);
        
        await updateJSON(shasum.digest('hex') , 0);
        await updateJSON(decryptValue);
        
        res.redirect('/submit?json=true');

    },
    async submit(req, res){

        var token = process.env.CODENATION_TOKEN;
        var json = false;

        if(req.query.json)
            json = true;

        res.render('index', {token, json})
    
    },
}