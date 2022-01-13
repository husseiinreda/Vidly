const mongoose = require('mongoose');
const Joi = require('joi');
const bcrybt = require('bcrypt');
const express = require('express');
const { User } = require('../models/user');
const router = express.Router();
const valid = require('../middleware/validate');


router.post('/',valid(validate),async(req,res)=>{
    let user = await User.findOne( { email:req.body.email} );
    if(!user) return res.status(400).send("Invalid email or password...");
    
    
    const validPassword = await bcrybt.compare(req.body.password,user.password);
    if(!validPassword) return res.status(400).send("Invalid email or password...");

    const token = user.generateAuthToken();
    res.send(token);
});

function validate(request){
    var schema=Joi.object({
        email:Joi.string().required().email(),
        password:Joi.string().required()
    });
    return schema.validate(request);
}

module.exports = router;