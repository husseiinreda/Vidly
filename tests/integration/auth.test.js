let server;
const request = require('supertest');
const { User } = require('../../models/user');

describe('auth middleware',()=>{
    let token;
    beforeEach(()=>{
        server=require('../../index');
        token=new User().generateAuthToken();
    });
    afterEach(()=>{
        server.close();
    });

    const exec = ()=> request(server)
        .post('/api/genres')
        .set('x-json-token',token)
        .send({name:'genre1'});
    
    it('should return 401 if no token',async()=>{
        token='';
        const res = await exec();
        expect(res.status).toBe(401);
    });
    it('should return 400 if invalid token',async()=>{
        token='123';
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it('should return 200 if valid token',async()=>{
        const res = await exec();
        expect(res.status).toBe(200);
    });
});