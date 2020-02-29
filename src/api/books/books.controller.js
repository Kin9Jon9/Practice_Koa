const Book = require('../../model/book');

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

exports.delete = (ctx)=>{
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

exports.replace = (ctx)=>{
    ctx.body = 'replaced';
}

exports.update = (ctx)=>{
    ctx.body = 'updated';
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

