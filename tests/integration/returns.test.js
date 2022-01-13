const mongoose = require('mongoose');
const { Rental } = require('../../models/rentals');
const request = require('supertest');
const { User } = require('../../models/user');
const moment = require('moment');
const { Movie } = require('../../models/movies');

describe('/api/returns',()=>{
    let server;
    let customerId;
    let movieId;
    let rental;
    let token;
    let movie;
    const exec = ()=>{
        return request(server)
            .post('/api/returns')
            .set('x-json-token',token)
            .send({customerId,movieId});
    };
    beforeEach(async ()=>{
        server = require('../../index');
        await Rental.remove({});
        await Movie.remove({});
        customerId= mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();
        movie = new Movie({
            _id:movieId,
            title:"12345",
            dailyRentalRate:2,
            numberInStock:10,
            genre:{
                name:"12345"
            }
        })
        await movie.save();
        rental = new Rental({
            customer:{
                _id:customerId,
                name:"12345",
                phone:"12345"
            },
            movie:{
                _id:movieId,
                title:"12345",
                dailyRentalRate:2
            }
        });
        await rental.save();
    });
    afterEach(()=>{
        server.close();
    });
    it('should return 401 if not logged in', async ()=>{
        token='';
        const result = await exec();
        expect(result.status).toBe(401);
    });
    it('should return 400 if movieId is not provided', async ()=>{
        movieId='';
        const result = await exec(); 
        expect(result.status).toBe(400);
    });
    it('should return 400 if customerId is not provided', async ()=>{
        customerId='';
        const result = await exec();
        expect(result.status).toBe(400);
    });
    it('should return 404 if no rental found', async ()=>{
        await Rental.remove({});
        const result = await exec();
        expect(result.status).toBe(404);
    });
    it('should return 400 if rental is already returned', async ()=>{
        rental.dateReturned=Date.now();
        await rental.save();
        const result = await exec();
        expect(result.status).toBe(400);
    });
    it('should return 200 if valid request', async ()=>{
        const result = await exec();
        expect(result.status).toBe(200);
    });
    it('should set the return date if input is valid', async ()=>{
        await exec();
        const result = await Rental.findById(rental._id);
        const diff = Date.now()-result.dateReturned;
        expect(diff).toBeLessThan(1000);
    });
    it('should set the rentalFee if input is valid', async ()=>{
        rental.dateOut = moment().add(-7,'days').toDate();
        await rental.save();

        await exec();
        const result = await Rental.findById(rental._id);
        expect(result.rentalFee).toBe(14);
    });
    it('should increase the stock if input is valid', async ()=>{
        await exec();
        const result = await Movie.findById(movieId);
        expect(result.numberInStock).toBe(11);
    });
    it('should return rental if input is valid', async ()=>{
        const res = await exec();
        expect(res.body).toHaveProperty('customer');
        expect(res.body).toHaveProperty('movie');
        expect(res.body).toHaveProperty('dateOut');
    });
});