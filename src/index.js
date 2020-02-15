const Koa = require('koa');
const app = new Koa();

app.use(ctx =>{
    console.log(1);
})

app.use(ctx =>{
    console.log(2);
})

app.use(ctx=>{
    ctx.body = 'Hello Kim';
})

app.listen(4000, ()=>{
    console.log('짜잔 서버 돈다.');
})