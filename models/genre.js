const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:5,
        maxlength:50
    }
});

const Genre = mongoose.model('Genre',genreSchema);

function validate(request){
    var schema=Joi.object({
        name:Joi.string().min(5).required(),
    });
    return schema.validate(request);
}

exports.genreSchema = genreSchema;
exports.Genre=Genre;
exports.validate=validate;