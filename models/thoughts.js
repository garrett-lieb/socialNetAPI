const {Schema, model, Types} = require('mongoose');
const moment = require('moment');

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
    },
    // associate with the thought
    thoughtId: {
        type: Schema.Types.ObjectId,
        ref: 'Thought'
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


