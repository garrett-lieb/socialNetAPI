const {Schema, model} = require('mongoose'); 
const moment = require('moment');


// schema to create a new user
//username
//email
//thoughts
//friends

const UserSchema = new Schema({
    username: {
        type: String,
        required: 'Username is required',
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: 'Email is required',
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid e-mail address']
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
},
{
    toJSON: {
        virtuals: true
    },
    id: false
});

UserSchema.virtual('friendCount')
.get(function() {
    return this.friends.length;
})
.set(function() {
    return this.friends.length;
});
    

const User = model('User', UserSchema);
module.exports = User;