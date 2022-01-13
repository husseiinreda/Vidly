const mongoose = require('mongoose');
const express = require('express');
const { Movie, validate } = require('../models/movies');
const { Genre } = require('../models/genre');
const auth = require('../middleware/auth');
const router = express.Router();
const valid = require('../middleware/validate');


router.get('/',async(req,res)=>{
    res.send(await Movie.find());
});

router.post('/',[auth,valid(validate)],async(req,res)=>{
    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('Genre not found...');
    const movie = new Movie({
        title:req.body.title,
        genre:genre,
        numberInStock:req.body.numberInStock,
        dailyRentalRate:req.body.dailyRentalRate,
    });
    res.send(await movie.save());
});

router.put('/:id',[auth,valid(validate)],async(req,res)=>{    
    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(400).send('Genre not found...');

    const movie = await Movie.findByIdAndUpdate(req.params.id,{
        title:req.body.title,
        genre:genre,
        numberInStock:req.body.numberInStock,
        dailyRentalRate:req.body.dailyRentalRate,
        },{new:true});
    if(!movie) return res.status(404).send("movie not found..");

    res.send(movie);
});

router.delete('/:id',auth,async(req,res)=>{
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if(!movie) return res.status(404).send("movie not found..");
    res.send(movie);
});

module.exports = router;