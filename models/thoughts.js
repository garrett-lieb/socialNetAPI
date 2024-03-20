const {Schema, model, Types} = require('mongoose');
const moment = require('moment');

// schema to create a new thought
// thought text (string) (required) (between 1 and 280 characters)
// createdAt (timestamp)
// username  (string) (required)
// reactions

const ReactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
    },
    reactionBody: {
        type: String,
        required: 'Reaction is required',
        minlength: 1,
        maxlength: 280
    },
    username: {
        type: String,
        required: 'Username is required'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp) => moment(timestamp).format('MMM DD, YYYY [at] hh:mm a')
    }
},
{
    toJSON: {
        getters: true
    }
});

const thoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: 'Thought is required',
        minlength: 1,
        maxlength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp) => moment(timestamp).format('MMM DD, YYYY [at] hh:mm a')
    },
    username: {
        type: String,
        required: 'Username is required'
    },
    reactions: [ReactionSchema]
},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
});


thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);
module.exports = Thought;
