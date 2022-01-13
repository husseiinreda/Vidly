const mongoose = require('mongoose');
const express = require('express');
const { Customer, validate } = require('../models/customer');
const router = express.Router();
const valid = require('../middleware/validate');

router.get('/',async(req,res)=>{
    res.send(await Customer.find());
});

router.post('/',valid(validate),async(req,res)=>{
    const customer= new Customer({
        name:req.body.name,
        phone:parseInt(req.body.phone),
        isGold:req.body.isGold,
    });
    res.send(await customer.save());
});

router.put('/:id',valid(validate),async(req,res)=>{
    const customer  = await Customer.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        phone:parseInt(req.body.phone),
        isGold:req.body.isGold,
        },{new:true});
    if(!customer) return res.status(404).send("customer not found..");

    res.send(customer);
});

router.delete('/:id',async(req,res)=>{
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if(!customer) return res.status(404).send("customer not found..");
    res.send(customer);
});

module.exports = router;