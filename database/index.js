const mongoose = require('mongoose');
const Schema = mongoose.Schema ;

const UserSchema = new Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : String
});

const TodoSchema = new Schema({
    userId : Schema.Types.ObjectId,
    title : String,
    description : String,
    done : Boolean
});

const User = mongoose.model('User', UserSchema); // [User collection, Schema]
const Todo = mongoose.model('Todo', TodoSchema);

module.exports = {
    User,
    Todo
}