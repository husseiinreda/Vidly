const Joi = require('joi');
const mongoose = require('mongoose');

const Rental = mongoose.model('Rental',mongoose.Schema({
    customer:{
        type:new mongoose.Schema({
            name:{
                type:String,
                required:true,
                minlength:5,
                maxlength:50
            },
            isGold:{
                type:Boolean,
                default:false
            },
            phone:{
                type:String,
                required:true,
                maxlength:11,
                minlength:5
            }
        }),
        required:true,
    },
    movie:{
        type:new mongoose.Schema({
        title:{
            type:String,
            required:true,
            minlength:5,
            maxlength:50
        },
        dailyRentalRate:{
            type:Number,
            required:true,
            min:0
        }
        }),
        required:true
    },
    dateOut:{
        type:Date,
        required:true,
        default:Date.now()
    },
    dateReturned:{
        type:Date,
    },
    rentalFee:{
        type:Number,
        min:0
    }
}));

function validate(request){
    var schema=Joi.object({
        customerId:Joi.objectId().required(),
        movieId:Joi.objectId().required(),
    });
    return schema.validate(request);
}

exports.Rental=Rental;
exports.validate=validate;