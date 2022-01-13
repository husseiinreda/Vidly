const mongoose = require('mongoose');
const bcrybt = require('bcrypt');
const express = require('express');
const _ = require('lodash');
const auth = require('../middleware/auth');
const { User, validate } = require('../models/user');
const valid = require('../middleware/validate');
const router = express.Router();

router.get('/me',auth,async(req,res)=>{
    const user = await User.findById(req.user.id).select('-password');
    res.send(user);
});

router.post('/',valid(validate),async(req,res)=>{
    let user = await User.findOne( { email:req.body.email} );
    if(user) return res.status(400).send("This email is already registered...");
    
    user = new User( _.pick(req.body,['name','email','password']));
    const salt = await bcrybt.genSalt(10);
    user.password = await bcrybt.hash(user.password,salt);
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-json-token',token).send( _.pick(user,['_id','name','email']));
});

module.exports = router;