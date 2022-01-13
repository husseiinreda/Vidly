const Joi = require('joi');
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer',mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:5,
        maxlength:50
    },
    isGold:{
        type:Boolean,
        default:true
    },
    phone:{
        type:String,
        required:true,
        maxlength:11,
        minlength:5
    }
}));

function validate(request){
    var schema=Joi.object({
        name:Joi.string().min(3).required(),
        phone:Joi.string().min(5).required(),
    });
    return schema.validate(request);
}

exports.Customer=Customer;
exports.validate=validate;