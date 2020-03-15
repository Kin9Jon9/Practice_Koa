const Book = require('../../model/book');
const Joi = require('joi');
const {Types: { ObjectId} } = require('mongoose');
//const ObjectId = require('mongoose').Types.ObjectId 동일한 코드

//전체 목록 가져오기
exports.list = async (ctx)=>{
    let books;

    try{
        books = await Book.find()
        .sort({_id: -1})
        .limit(3)
        .exec();
    }catch (e){
        return ctx.throw(500, e);
    }

    ctx.body = books;
};

//하나 추가하기
exports.create = async (ctx)=>{
    const {
        title,
        authors,
        publishedDate,
        price,
        tags
    } = ctx.request.body;

    //Book 인스턴스를 생성합니다.
    const book = new Book({
        title,
        authors,
        publishedDate,
        price,
        tags
    });

    try{
        await book.save();
    }catch(e){
        return ctx.throw(500, e);
    }

    ctx.body = book;
};

//하나 삭제하기
exports.delete = async (ctx)=>{
    const { id } = ctx.params;

    try{
        await Book.findByIdAndRemove(id).exec();
    }catch(e){
        if(e.name === 'CastError'){
            ctx.status = 400;
            return;
        }
    }

    ctx.status = 204; // No Content
}

exports.replace = async (ctx)=>{
    const { id } = ctx.params;

    if(ObjectId.isValid(id)){
        ctx.status = 400;
        return;
    }

    const schema = Joi.object().keys({
        title : Joi.string().required(),
        authors : Joi.array().items(Joi.object().key({
            name : Joi.string().required(),
            email : Joi.string().email().required() 
        })),
        publishedDate : Joi.data().required(),
        price : Joi.number().required(),
        tags : Joi.array().items((Joi.string()).required())

    });

    const result = Joi.validate(ctx.request.body, schema);

    if(result.error){
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    let book;

    try{
        book = await Book.findByIdAndUpdate(id, ctx.request.body, {
            upsert : true, // upsert가 true면 데이터가 없을 때 새로 만들어줌
            new : true // 이값을 넣어줘야 반환 값이 새로운 값임
        });
    }catch(e){
        return ctx.throw(500, e);
    }
    ctx.body = book;
}

exports.update = async (ctx)=>{
    const { id } = ctx.params;

    if(!ObjectId.isValid(id)){
        ctx.status = 400;
        return;
    }

    let book;

    try{
        book = await Book.findByIdAndUpdate(id, ctx.request.body,{
            new : true
        });
    }catch(e){
        return ctx.throw(500, e);
    }

    ctx.body = book;
}

//id 해당하는 하나 가져오기
exports.get = async (ctx)=>{
    const {id} = ctx.params;

    let book;

    try{
        book = await Book.findById(id).exec();
    }catch(e){
        if(e.name === 'CastError'){
            ctx.status = 400;
            return;
        }
        return ctx.throw(500, e);
    }

    if(!book){
        ctx.status = 404;
        ctx.body = {message:'book not found'};
        return;
    }
    ctx.body = book;
}

