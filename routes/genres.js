const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const { Genre, validate } = require('../models/genre');
const router = express.Router();
const valid = require('../middleware/validate');


router.get('/',async(req,res,next)=>{
    try{
        //await Promise.reject();
        res.send(await Genre.find());
    }
    catch(ex){
        //something wrong here
        next(ex);
    }
});

router.post('/',[auth,valid(validate)],async(req,res)=>{
    const genre= new Genre({
        name:req.body.name,
    });
    res.send(await genre.save());
});

router.put('/:id',[auth,valid(validate)],async(req,res)=>{
    const genre  = await Genre.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        },{new:true});
    if(!genre) return res.status(404).send("genre not found..");

    res.send(genre);
});

router.delete('/:id',[auth,admin],async(req,res)=>{
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if(!genre) return res.status(404).send("genre not found..");
    res.send(genre);
});

module.exports = router;