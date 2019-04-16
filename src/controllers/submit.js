//SUBMIT CLASS
class SubmitController{
    async submit(req, res){

        var token = process.env.CODENATION_TOKEN;
        var json = false;

        if(req.query.json)
            json = true;

        res.render('index', {token, json});
    
    }
}

module.exports = new SubmitController();