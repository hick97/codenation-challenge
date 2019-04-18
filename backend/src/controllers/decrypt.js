const axios = require('axios');
const fs = require('fs');
const sha1 = require('sha1');
const crypto = require('crypto'), shasum = crypto.createHash('sha1');
const path = require('path');
const fileName = path.join(__dirname, '..', '..', 'answer.json');
const file = require(fileName);

'use strict';

//FUNCTIONS
async function createJson(params = {}){
    let data = await JSON.stringify(params);
 
    await fs.writeFileSync('answer.json', data); 
}

async function updateJSON(sha1, decryptValue){

    var obj = await JSON.parse(fs.readFileSync(fileName, 'utf8'));

    obj.decifrado = decryptValue;
    obj.resumo_criptografico = sha1;

    await fs.writeFileSync('answer.json', JSON.stringify(obj)); 

}

async function decrypt(encryptValue, positionsToBack){

    var originalAlphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v','w', 'x', 'y', 'z'];
    //['z', 'y', 'x' ... , 'a']
    var alphabet = originalAlphabet.reverse();

    var splitEncrypt = encryptValue.toLowerCase().split('');

    var result = '';

    for(var i = 0; i < splitEncrypt.length; i++){

        if(splitEncrypt[i].match(/[A-Z]/gi)){

            var newPosition = await ((alphabet.indexOf(splitEncrypt[i]) + positionsToBack) % alphabet.length);
            
            result = result + alphabet[newPosition];

        }else{
            result = result + splitEncrypt[i]; 
        }
    }

    return result;
}

//DECRYPT CLASS
class DecryptController{
    async decrypt(req, res){

        var jsonStatus = '';

        try{

            var result = await axios.get('https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token='+ process.env.CODENATION_TOKEN);
            var numero_casas = result.data.numero_casas;
            var token = result.data.token;
            var cifrado = result.data.cifrado;
            var decifrado = result.data.decifrado;
            var resumo_criptografico = result.data.resumo_criptografico;

        }catch(err){

           if(err) 
                console.log('Falha ao realização requisição dos dados. Erro: ' + err.message);
                jsonStatus = 'Failed.';
                res.json({jsonStatus});
        }
        try{

            await createJson({
                numero_casas: numero_casas,
                token: token,
                cifrado: cifrado,
                decifrado: decifrado,
                resumo_criptografico: resumo_criptografico
            });

        }catch(err){

            if(err) 
                console.log('Falha ao criar JSON. Erro: ' + err.message);
                jsonStatus = 'Failed.';
                res.json({jsonStatus});
        }
        try{

            var decryptValue = await decrypt(cifrado, numero_casas);
            await shasum.update(decryptValue);
            
            await updateJSON(shasum.digest('hex') , decryptValue);
            
            jsonStatus = 'Success!';

            res.json({
                jsonStatus, 
                token: process.env.CODENATION_TOKEN, 
                uploadURL: `${process.env.APP_URL}/download`
            });
            
        }catch(err){

            if(err)
                console.log('Falha ao atualizar JSON com valor decifrado. Erro: ' + err.message);
                jsonStatus = 'Failed.';
                res.json({jsonStatus});
        }
    }
}

module.exports = new DecryptController();