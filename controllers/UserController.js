import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/UserModel.js';
import { secret } from '../config.js';

const generateAccessToken = (id, roles, name, email) => {
    const payload = {
        id,
        roles,
        name,
        email
    };
    return jwt.sign(payload, secret, {expiresIn: '7d'});
}

export default class UserController {
    
    async registrationUser (req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array());
            }
            const {email} = req.body;
            const candidate = await UserModel.findOne({email});
            if (candidate) {
                return res.status(400).json({message: 'Попробуйте ещё раз'});
            }
            const password = req.body.password;
            const hashPassw = await bcrypt.hash(password, 8);
            const userData = new UserModel({
                name: req.body.name,
                email: req.body.email,
                password: hashPassw,
                avatar: req.body.avatar,
            });
            const user = await userData.save();
            const token = generateAccessToken(user._id, user.roles, user.name, user.email, user.avatar);
            res.json({
                ...user._doc,
                token
            });
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: 'Не удалось зарегистрировать пользователя'})
        }
    }

    async loginUser (req, res) {
        try {
            const user = await UserModel.findOne({email: req.body.email});
            const isValidPassw = await bcrypt.compare(req.body.password, user._doc.password);
            if (!user || !isValidPassw) {
                return res.status(404).json({message: 'Неверный логин или пароль'});
            }
            const token = generateAccessToken(user._id, user.roles, user.name, user.email, user.avatar);
            res.json({
                ...user._doc,
                token
            });
        } catch (e) {
            return res.status(500).json({message: 'Не удалось войти'});
        }
    }

    getUser (req, res) {
        try {
            if (!req.user) {
                return res.status(404).json({message: 'Пользователь не найден'});
            }
            res.json({...req.user});
        } catch (e) {
            return res.status(500).json({message: 'Не удалось найти пользователя'});
        }
    }
};