import express from 'express';
import authRouter from './routes/authRouter.js';
import postRouter from './routes/postRouter.js';
import commentRouter from './routes/commentRouter.js';
import mongoose from 'mongoose';
import multer from 'multer';
import { authMiddleware } from './middleware/authMiddleware.js';

const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const upload = multer({storage});

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/auth', authRouter);
app.use('/posts', postRouter);
app.use('/comment', commentRouter);
app.post('/upload', authMiddleware, upload.single('image'), (req, res) => {
    res.json({
        url: `/upload/${req.file.originalname}`
    })
})

const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://daniil:173455dan@cluster0.b5bxyuj.mongodb.net/');
        app.listen(3001, () => {
            console.log('Server work');
        });
    } catch (e) {
        console.log(e);
    }
};

start();