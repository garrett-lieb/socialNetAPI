const {Thought, User} = require('../models');

module.exports = {
    // get all thoughts
 async getAllThoughts(req, res) {
        try {
            const thoughts = await Thought.find({});
            res.json(thoughts);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },
    // get one thought by id
    async getThoughtById({params}, res) {
        try {
            const thought = await Thought.findOne({_id: params.id});
            if (!thought) {
                res.status(404).json({message: 'No thought found with this id'});
                return;
            }
            res.json(thought);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },
    // create a thought
    async createThought({body}, res) { 
        try {
           const thought = await Thought.create(body);
           const userData = await User.findOneAndUpdate(
            // associate the thought with the user
            { username: body.username },
            { $addToSet: { thoughts: thought._id } },
            { new: true }
        ); 
        res.json(userData);
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    },
    // update a thought by id
async updateThought({params, body}, res) {
        try {
            const thought = await Thought.findOneAndUpdate({_id: params
                .id}, body, {new: true, runValidators: true});
                if (!thought) {
                    res.status(404).json({message: 'No thought found with this id'});
                    return;
                }
                res.json(thought);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },
    // delete a thought by id
async deleteThought({params}, res) {
        try {
            const thought = await Thought.findOneAndDelete({_id: params.id});
            if (!thought) {
                res.status(404).json({message: 'No thought found with this id'});
                return;
            }
            const userData = await User.findOneAndUpdate(
                { thoughts: params.id },
                { $pull: { thoughts: params.id } },
                { new: true }
            );
            res.json(userData);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },
// add a reaction to a thought
async addReaction({params, body}, res) {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $addToSet: { reactions: body } },
            { new: true }
        );
        if (!thought) {
            res.status(404).json({ message: 'No thought found with this id' });
            return;
        }
        res.json(thought);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
},
// get all reactions for a thought
async getAllReactions({params}, res) {
    try {
        const thought = await Thought.findOne({ _id: params.thoughtId });
        if (!thought) {
            res.status(404).json({ message: 'No thought found with this id' });
            return;
        }
        res.json(thought.reactions);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
},
// get one reaction by id
async getReactionById({params}, res) {
    try {
        const thought = await Thought.findOne(
            { _id: params.thoughtId },
            {
                reactions: { $elemMatch: { _id: params.reactionId } }
            }
        );
        if (!thought) {
            res.status(404).json({ message: 'No thought found with this id' });
            return;
        }
        const reaction = thought.reactions[0];
        res.json(reaction);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
},
// delete a reaction from a thought
async deleteReaction({params}, res) {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { _id: params.reactionId } } },
            { new: true }
        );
        if (!thought) {
            res.status(404).json({ message: 'No thought found with this id' });
            return;
        }
        res.json(thought);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}
};
