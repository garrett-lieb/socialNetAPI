const {Schema, model} = require('mongoose');
const Thought = require('./thoughts');

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

UserSchema.pre('remove', function(next) {
    Thought.remove({ userId: this._id })
        .then(() => next())
        .catch(err => next(err));
});
    

const User = model('User', UserSchema);
module.exports = User;