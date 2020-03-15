const Joi = require('joi');
const Account = require('../../model/account')

//로컬 회원가입
exports.localRegister = async (ctx)=>{
    
    //데이터 검증
    const schema = Joi.object().keys({
        username : Joi.string().alphanum().min(4).max(15).required(),
        email : Joi.string().email().required(),
        password : Joi.string().required().min(6)
    });

    const result = Joi.validate(ctx.request.body, schema);

    if(result.error){
        ctx.status = 400;
        return;
    }

    //아이디 or 이메일 중복 체크

    let existing = null;

    try {
        existing = await Account.findByEmailOrUsername(ctx.request.body);
    }catch(e){
        ctx.throw(500, e);
    }

    if(existing){
    //중복되는 아이디 or 이메일이 있을 경우
        ctx.status = 409; //Conflict
        //어떤 값이 중복되어있는지 알려줌
        ctx.body = {
            key : existing.email === ctx.request.body.email ? 'email' : 'username'
        };
        return;
    }

    // 계정 생성

    let account = null;

    try{
        account = await Account.localRegister(ctx.request.body);
    }catch(e){
        ctx.throw(500, e);
    }

    ctx.body = account.profile; //프로필 정보로 응답함.
};

//로컬 로그인
exports.localLogin = async (ctx)=>{
    const schema = Joi.object().keys({
        email : Joi.string().email().required(),
        password : Joi.string().required()
    });

    const result = Joi.validate(ctx.request.body, schema);

    if(result.error){
        ctx.status = 400;
        return;
    }

    const { email, password } = ctx.request.body;

    let account = null;

    try{
        account = await Account.findByEmail(email);
    }catch(e){
        ctx.throw(500, e);
    }

    if(!account || !account.validatePassword(password)){
        //유저 없음 || 비밀번호 불일치
        ctx.status = 403;
        return;
    }
    
    ctx.body = account.profile;

};

// 이메일 / 아이디 존재 유무 확인
exports.exists = async (ctx)=>{
    const {key, value} = ctx.params;
    let account = null;

    try{
        account = await (key === 'email' ? Account.findByEmail(value) : Account.findByUsername(value));
    }catch(e){
        ctx.throw(500, e);
    }

    ctx.body = {
        exists : account !== null
    };
};

// 로그아웃
exports.logout = async (ctx)=>{
    ctx.body = 'logout';
};

