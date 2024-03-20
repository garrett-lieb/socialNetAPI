const {ObjectID} = require('mongodb');
const {User, Thought} = require('../models');

// get all users
module.exports = {
    getAllUsers(req, res) {
        User.find({})
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .select('-__v')
        .sort({_id: -1})
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    // get one user by id
    getUserById({params}, res) {
        User.findOne({_id: params.id})
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .populate ("thoughts")
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({message: 'No user found with this id'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    // create a user
    createUser({body}, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(500).json(err));
    },
    // update a user by id
    updateUser({params, body}, res) {
        User.findOneAndUpdate({_id: params.id}, body, {new: true, runValidators: true})
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({message: 'No user found with this id'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(500).json(err));
    },
    // delete a user by id
    deleteUser({params}, res) {
        User.findOneAndDelete({_id: params.id})
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({message: 'No user found with this id'});
                return;
            }
            return Thought.deleteMany(
                {_id: {$in: dbUserData.thoughts}}
            );
        })
        .then(() => {
            res.json({message: 'User and associated thoughts deleted'});
        })
        .catch(err => res.status(500).json(err));
    },
    // add a friend to a user's friend list
    addFriend({params, body}, res ) {
        User.findOneAndUpdate(
            {_id: params.userId},
            {$addToSet: {friends: params.friendId}},
            {new: true}
        )
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({message: 'No user found with this id'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(500).json(err));
    },
    // remove a friend from a user's friend list
    deleteFriend({params}, res) {
        User.findOneAndUpdate(
            {_id: params.userId},
            {$pull: {friends: params.friendId}},
            {new: true}
        )
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({message: 'No user found with this id'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(500).json(err));
    }

    // BONUS: Remove a user's associated thoughts when deleted.
};

