const express = require("express");
const router = express.Router();

const comments = require("../data/comments");
const error = require("../utilities/error");

// Helper function that finds a comment by its ID
const findComment = (id) => comments.find((c) => c.id === parseInt(id));

// Helper function that generates a unique but simple ID
const generateUniqueId = () => {
    if (comments.length === 0) {
        return 1;
    }
    return Math.max(...comments.map((comment) => comment.id)) + 1;
};

// GET /comments/
router
    .route("/")
    .get((req, res) => {
        // Handle userId and postId query parameters
        
        // GET /comments?userId=<VALUE>
        // Retrieve comments made by a specific user
        if (req.query.userId) {
            const userComments = comments.filter(
                (c) => c.userId === parseInt(req.query.userId)
            );
            return res.json(userComments);
        }
        // GET /comments?postId=<VALUE>
        // Retrieve comments made on a specific post
        if (req.query.postId) {
            const postComments = comments.filter(
                (c) => c.postId === parseInt(req.query.postId)
            );
            return res.json(postComments);
        }
        res.json(comments);
    })
    /**
     * POST /comments/
     * When creating a new comment object, it should have the following fields:
     * id: a unique identifier.
     * userId: the id of the user that created the comment.
     * postId: the id of the post the comment was made on.
     * body: the comment's text
     */
    .post((req, res, next) => {
        if (req.body.userId && req.body.postId && req.body.body) {
            const newComment = {
                id: generateUniqueId(),
                userId: parseInt(req.body.userId),
                postId: parseInt(req.body.postId),
                body: req.body.body,
            };
            comments.push(newComment);
            res.status(201).json(newComment); // 201 Created for successful POST request
        } else {
            next(error(400, "Insufficient data to create comment"));
        }
    });

// GET /comments/:id
// GET the comment with the specified id
router
    .route("/:id")
    .get((req, res, next) => {
        const comment = findComment(req.params.id);
        if (comment) {
            res.json(comment);
        } else {
            next(error(404, "Comment not found"));
        }
    })
    /**
     * PATCH /comments/:id
     * Update a comment with the specified id with a new body
     */
    .patch((req, res, next) => {
        const comment = findComment(req.params.id);
        if (comment) {
            if (req.body.body) {
                comment.body = req.body.body;
                res.json(comment);
            } else {
                next(error(400, "Missing 'body' in request"));
            }
        } else {
            next(error(404, "Comment not found"));
        }
    })
    // DELETE /comments/:id
    // Delete a comment with the specified id
    .delete((req, res, next) => {
        const index = comments.findIndex((c) => c.id === parseInt(req.params.id));
        if (index !== -1) {
            const deletedComment = comments.splice(index, 1)[0];
            res.json(deletedComment);
        } else {
            next(error(404, "Comment not found"));
        }
    });



module.exports = router;