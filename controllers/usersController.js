const {User, Thought} = require('../models');

// get all users
module.exports = {
async getAllUsers(req, res) {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
},
    // get one user by id
 async getUserById({params}, res) {
        try {
            const user = await User.findOne({_id: params.id});
            if (!user) {
                res.status(404).json({message: 'No user found with this id'});
                return;
            }
            res.json(user);
        }
        catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },
    // create a user
async createUser({body}, res) {
        try {
            const user = await User.create(body);
            res.json(user);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },
    // update a user by id
async updateUser({params, body}, res) {
        try {
            const user = await User.findOneAndUpdate({_id:
                params.id}, body, {
                    new: true,
                    runValidators: true
                });
                if (!user) {
                    res.status(404).json({message: 'No user found with this id'});
                    return;
                }
                res.json(user);
        }
        catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },
    // delete a user by id and all their thoughts
async deleteUser({params}, res) {
        try {
            const
            {thoughts} = await User.findOneAndDelete({_id: params.id});
            await Thought.deleteMany({_id: {$in: thoughts}});
            res.json({message: 'User and associated thoughts deleted'});
        }
        catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },
    // add a friend to a user's friend list
async addFriend({params}, res) {
        try {
            const user = await User.findOneAndUpdate(
                {_id: params.userId},
                {$addToSet: {friends: params.friendId}},
                {new: true}
            );
            if (!user) {
                res.status(404).json({message: 'No user found with this id'});
                return;
            }
            res.json(user);
        }
        catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },
    // remove a friend from a user's friend list
async deleteFriend({params}, res) {
        try {
            const user = await User.findOneAndUpdate(
                {_id: params.userId},
                {$pull: {friends: params.friendId}},
                {new: true}
            );
            if (!user) {
                res.status(404).json({message: 'No user found with this id'});
                return;
            }
            res.json(user);
        }
        catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },
};

