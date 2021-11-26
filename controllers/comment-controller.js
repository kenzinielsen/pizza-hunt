const { Comment, Pizza } = require('../models');
const { db } = require('../models/Comment');

const commentController = {
    //add commment to pizza
    addComment({ params, body },res) {
        console.log(body);
        Comment.create(body)
        .then(({ _id }) => {
            return Pizza.findOneAndUpdate(
            { _id: params.pizzaId },
            { $push: { comments: _id } },
            { new: true }
            );
        })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => res.json(err));
    },
    addReply({ params, body }, res) {
        Comment.findOneAndUpdate(
            { _id: params.commentId },
            { $push: { replies: body } },
            { new: true, runValidators: true }
        )
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found witht this id' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    },
    removeReply({ params }, res) {
        Comment.findOneAndUpdate(
            { _id: params.commentId},
            { $pull: { replies: { repluId: params.replyId } } },
            { new: true }
        )
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => res.json(err));
    },
    //remove
    removeComment({ params }, res) {
        Comment.findOneAndDelete({ _id: params.commentId })
        .them(deletedComment => {
            if (!deletedComment) {
                return res.status(404).json({ message: 'no comment with this id'})
            }
            return Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                { $pull: { comments: params.commentId } },
                { new: true }
            )
        })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id' })
                return;
            }
            res.json(dbPizzaData);
        })
            .catch(err => res.json(err));
    }
};

module.exports = commentController;