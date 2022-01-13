const Joi = require('joi');
const mongoose = require('mongoose');
const { genreSchema } = require('./genre');

const Movie = mongoose.model('Movie',mongoose.Schema({
    title:{
        type:String,
        required:true,
        minlength:5,
        maxlength:50
    },
    genre:{
        type:genreSchema,
        required:true
    },
    numberInStock:{
        type:Number,
        default:0
    },
    dailyRentalRate:{
        type:Number,
        default:0
    }
}));

function validate(request){
    var schema=Joi.object({
        title:Joi.string().min(5).max(50).required(),
        genreId:Joi.string().required(),
        numberInStock:Joi.number().min(0),
        dailyRentalRate:Joi.number().min(0),
    });
    return schema.validate(request);
}

exports.Movie=Movie;
exports.validate=validate;