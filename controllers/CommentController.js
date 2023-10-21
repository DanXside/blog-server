import Comment from "../models/Comment.js";
import { validationResult } from "express-validator";

export default class CommentController {
    async createComment (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array());
            }
            const commentData = new Comment({
                text: req.body.text,
                user: req.body.user,
                post: req.body.post
            });
            const comment = await commentData.save();
            res.json(comment);
        } catch (e) {
            return res.status(500).json({message: 'Не удалось отправить комментарий'})
        }
    }

    async getComments (req, res) {
        try {
            const postId = req.query.id;
            await Comment.find({
                post: postId
            }).populate('user').then((doc, err) => {
                if (err) {
                    return res.status(500).json({message: 'Не удалось получить комментарии'})
                }
                if (!doc) {
                    return res.json({message: 'Нет комментариев'})
                }
                res.json(doc);
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: 'Не удалось загрузить комментарии'});
        }
    }
}