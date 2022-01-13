const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
let server;

describe('/api/genres',()=>{
    beforeEach(async()=>{ 
        server = require('../../index');
        await Genre.remove({});
     });
    afterEach(()=>{ 
        server.close(); 
    });

    describe('Get /',()=>{
        it('should return all genres', async ()=>{
            await Genre.collection.insertMany([
                { name:"Genre 1" },
                { name:"Genre 2" },
            ]);

            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g=>g.name==='Genre 1')).toBeTruthy();
            expect(res.body.some(g=>g.name==='Genre 2')).toBeTruthy();
        });
    });

    describe('Post /',()=>{
        let name;
        let token;
        const exec = async ()=>{
            return await request(server)
                .post('/api/genres')
                .set('x-json-token',token)
                .send({name});
        };
        beforeEach(()=>{
            token = new User().generateAuthToken();
            name='genre1';
        });
        it('should return 401 if not logged in', async ()=>{
            token='';
            const res = await exec();
            expect(res.status).toBe(401);
        });
        it('should return 400 if genre invalid', async ()=>{
            name='123';
            const res = await exec();
            expect(res.status).toBe(400);
        });
        it('should save genre if valid', async ()=>{
            await exec();
            const genre = await Genre.find({name});
            expect(genre).not.toBeNull();
        });
        it('should return genre if valid', async ()=>{
            const res = await exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name',name);
        });
    });
});