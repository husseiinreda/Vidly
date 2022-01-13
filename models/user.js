const Joi = require('joi');
const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:5,
        maxlength:50
    },
    email:{
        type:String,
        unique:true,
        required:true,
        pattern:/.*@.*.com$/
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({
        id:this._id,
        isAdmin:this.isAdmin
    },config.get('JwtPrivateKey'));
    return token;
}

const User = mongoose.model('User',userSchema);

function validate(request){
    var schema=Joi.object({
        name:Joi.string().min(5).required(),
        email:Joi.string().required().email(),
        password:Joi.string().min(8).required()
    });
    return schema.validate(request);
}

exports.User=User;
exports.validate=validate;