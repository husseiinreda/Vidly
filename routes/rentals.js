const mongoose = require('mongoose');
const express = require('express');
const { Rental, validate } = require('../models/rentals');
const { Customer } = require('../models/customer');
const auth = require('../middleware/auth');
const { Movie } = require('../models/movies');
const valid = require('../middleware/validate');

const router = express.Router();

router.get('/',async(req,res)=>{
    res.send(await Rental.find());
});

router.post('/',[auth,valid(validate)],async(req,res)=>{
    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('customer not found...');
    
    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send('movie not found...');

    if(movie.numberInStock==0) return res.status(400).send('movie out of stock...');

    const rental= new Rental({
        customer:{
            _id:customer.id,
            name:customer.name,
            isGold:customer.isGold,
            phone:customer.phone
        },
        movie:{
            _id:movie.id,
            title:movie.title,
            dailyRentalRate:movie.dailyRentalRate
        },
    });
    const result = await rental.save();
    movie.numberInStock--;
    await movie.save();
    res.send(result);
});

module.exports = router;