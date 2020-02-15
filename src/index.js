require('dotenv').config();

const Koa = require('Koa');
const Router = require('koa-router');


const app = new Koa();
const router = new Router();
const api = require('./api');

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(
    (response)=>{
        console.log('Successfully connected to mongodb');
    }
).catch(e =>{
    console.error(e);
})

const port = process.env.PORT || 4000;

router.use('/api', api.routes());

app.use(router.routes()).use(router.allowedMethods());

app.listen(4000, ()=>{
    console.log('server is listening to port 4000');
})