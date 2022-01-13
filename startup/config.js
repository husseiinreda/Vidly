const config = require('config');

module.exports = function(){
    if(!config.get('JwtPrivateKey')) {
        throw new Error('Jwt is not set...');
    }
}