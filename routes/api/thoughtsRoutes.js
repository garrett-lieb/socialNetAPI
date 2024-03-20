// get all thoughts

// get one thought by id

// post a new thought (don't forget to push the created thought's _id to the associated user's thoughts array field)

// put to update a thought by its id

// delete to remove a thought by its id

// BONUS: Remove a thought from a user's `thoughts` field when deleted.

const router = require('express').Router();
const {
    getAllThoughts,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    getAllReactions,
    deleteReaction
} = require('../../controllers/thoughtsController');

// /api/thoughts
router
    .route('/')
    .get(getAllThoughts)
    .post(createThought);

// /api/thoughts/:id
router
    .route('/:id')
    .get(getThoughtById)
    .put(updateThought)
    .delete(deleteThought);

// /api/thoughts/:thoughtId/reactions
router
    .route('/:thoughtId/reactions')
    .get(getAllReactions)
    .post(addReaction)
router
    .route('/:thoughtId/reactions/:reactionId')
    .delete(deleteReaction);

module.exports = router;