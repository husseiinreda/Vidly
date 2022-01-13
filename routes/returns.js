const express = require('express');
const moment = require('moment');
const { Rental } = require('../models/rentals');
const auth = require('../middleware/auth');
const { Movie } = require('../models/movies');
const validate = require('../middleware/validate');
const Joi = require('joi');
const router = express.Router();
 
router.post('/',[auth,validate(validateReturn)],async (req,res)=>{
    const rental = await Rental.findOne({
        'customer._id':req.body.customerId,
        'movie._Id':req.body.movieId
    });
    if(!rental) return res.status(404).send('no rental found..');

    if(rental.dateReturned) return res.status(400).send('rental already returned');

    rental.dateReturned = Date.now();
    const numOfDays = moment().diff(rental.dateOut,'days');
    rental.rentalFee = numOfDays * rental.movie.dailyRentalRate;
    await rental.save();

    const movie = await Movie.findById(rental.movie._id);
    movie.numberInStock++;
    await movie.save();
    
    return res.status(200).send(rental);
});

function validateReturn(request){
    var schema=Joi.object({
        customerId:Joi.objectId().required(),
        movieId:Joi.objectId().required()
    });
    return schema.validate(request);
}

module.exports = router;