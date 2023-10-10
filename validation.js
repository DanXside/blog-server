import { body } from "express-validator";


export const registrationValidator = 
    [
        body('name', 'Укажите ваше имя (не менее 3)').isLength({min: 3}),
        body('email', 'Неверный формат почты').isEmail(),
        body('password', 'Пароль должен содержать не менее 4 символов').isLength({min: 4}),
        body('avatar', "Неверная ссылка").optional().isURL(),
    ];

export const postValidator = [
    body('title', 'Заголовок поста не менее 6 символов').isLength({min: 6}).isString(),
    body('text').optional().isString(),
    body('sections').optional().isArray(),
    body('postImage').optional().isURL()
];