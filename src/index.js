require('dotenv').config();

const Koa = require('Koa');
const Router = require('koa-router');


const app = new Koa();
const router = new Router();
const api = require('./api');
const {jwtMiddleware} = require('./api/lib/token');

const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser');

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

app.use(bodyParser());

app.use(jwtMiddleware);
router.use('/api', api.routes()); // api 라우트를 /api 경로 하위 라우트로 설정

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, ()=>{
    console.log('server is listening to port '+ port);
})