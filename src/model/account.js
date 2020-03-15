const mongoose = require('mongoose');
const {Schema} = mongoose;
const crypto = require('crypto');

function hash(password){
    return crypto.createHmac('sha256', process.env.SECRET_KEY).update(password).digest('hex');
}

const Account = new Schema({
    profile : {
        username : String,
        thumbnail : {type : String, default : '/static/images/default_thumbnail.png'}
    },
    email : {type : String},
    //OAuth로 회원가입을 할 경우에는 각 서비스에서 제공되는 id와 accessToken을 저장한다.
    social : {
        facebook : { 
            id : String,
            accessToken : String
        },
        google : { 
            id : String,
            accessToken : String
        }
    },
    password : String,
    thoughtCount: {type: Number, default : 0},
    createdAt : {type : Date, default: Date.now}
})

Account.statics.findByUsername = function(username){
    return this.findOne({'profile.username' : username}).exec();
};

Account.statics.findByEmail = function(email){
    return this.findOne({email}).exec();
};

Account.statics.findByEmailOrUsername = function({username, email}){
    
    //$or 연산자를 통해 둘중에 하나를 만족하는 데이터를 찾음
    return this.findOne({

        $or : [
            {'profile.username' : username},
            {email}
        ]
    }).exec();
};

Account.statics.localRegister = function({username, email, password}){
    const account = new this({
        profile : {
            username
            //thumbnail 값을 설정하지 않으면 기본값으로 설정 됌.
        },
        email,
        password : hash(password)
    });

    return account.save();
};

Account.methods.validatePassword = function(password){
    const hashed = hash(password);
    return this.password === hashed;
};

module.exports = mongoose.model('Account', Account);