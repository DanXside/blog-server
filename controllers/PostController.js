import PostModel from "../models/PostModel.js";
import { validationResult } from "express-validator";

export default class PostController {
    
    async createPost (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array());
            }
            const postData = new PostModel({
                title: req.body.title,
                text: req.body.text,
                postImage: req.body.postImage,
                sections: req.body.sections,
                user: req.user.id
            });

            if (!postData) {
                return res.status(400).json({message: 'Заполните обязательные поля'});
            }
    
            const post = await postData.save();
            res.json(post);
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: 'Не удалось создать пост'})
        }
    }

    async getPosts (req, res) {
        try {
            const page = req.query.page;
            const limit = req.query.limit;
            const startIndex = (Number(page) - 1) * limit;
            const posts = await PostModel.find().populate('user').limit(limit).skip(startIndex).exec();

            const totalPages = Math.ceil(await PostModel.countDocuments({}) / limit);
            if (!posts) {
                return res.status(404).json({message: 'Посты не найдены'})
            }
            res.json({
                posts,
                pagination: {
                    currPage: page,
                    total: totalPages
                }
            });
        } catch (e) {
            return res.status(500).json({message: 'Не удалось найти посты'})
        }
    }

    getPost (req, res) {
        try {
            const postId = req.query.id;
            PostModel.findOneAndUpdate(
                {
                    _id: postId
                },
                {
                    $inc: {viewsCount: 1}
                },
                {
                    returnDocument: 'after'
                }
            ).populate('user').then((doc, err) => {
                if (err) {
                    return res.status(500).json({message: 'Не удалось вернуть пост'})
                }
                if (!doc) {
                    return res.status(404).json({message: 'Пост не найден'})
                }
                res.json(doc);
            });
        } catch (e) {
            return res.status(500).json({message: 'Не удалось найти пост'})
        }
    }

    async updatePost (req, res) {
        try {
            const postId = req.params.id;
            const updatePost = await PostModel.updateOne(
                {
                    _id: postId
                },
                {
                    title: req.body.title,
                    text: req.body.text,
                    postImage: req.body.postImage,
                    sections: req.body.sections,
                }
            );
            if (!updatePost) {
                return res.status(404).json({message: 'Не удалось найти и обновить пост'});
            }
            res.json({
                success: true
            });
        } catch (e) {
            return res.status(500).json({message: 'Не удалось обновить пост'})
        }
    }

    deletePost (req, res) {
        try {
            const postId = req.query.id;
            PostModel.findOneAndDelete(
                {
                    _id: postId
                }
            ).then((doc, err) => {
                if (err) {
                    return res.status(500).json({message: 'Не удалось удалить пост'})
                }
                if (!doc) {
                    return res.status(404).json({message: 'Пост не найден'})
                }
                res.json({
                    success: true
                });
            });
        } catch (e) {
            return res.status(500).json({message: 'Не удалось удалить пост'})
        }
    }
}