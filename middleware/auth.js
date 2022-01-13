const jwt = require('jsonwebtoken');
const config = require('config');
module.exports = function(req,res,next){
    const token = req.header('x-json-token');
    if(!token) return res.status(401).send('Access is denied...');

    try{
        const decoded = jwt.verify(token,config.get('JwtPrivateKey'));
        req.user = decoded;
        next();
    }
    catch(ex){
        res.status(400).send('Invalid Token');
    }

}