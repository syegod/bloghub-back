import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import multer from 'multer';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { PostController, UserController } from './controllers/index.js';
import checkAuth from './utils/checkAuth.js';
import connectdb from './db/connectdb.js';
import bodyParser from 'body-parser';
import strictAuth from './utils/strictAuth.js';
config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'static')));

connectdb();


const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'static');
    }, filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

app.post('/auth/register', UserController.register);
app.post('/auth/login', UserController.login);
app.get('/auth/get-me', strictAuth, UserController.getMe);
app.get('/auth/get-all-users', UserController.getAllUsers);

app.post('/posts', strictAuth, upload.single('image'), PostController.create_post);
app.get('/posts', checkAuth, PostController.get_posts);
app.patch('/posts', strictAuth, PostController.handle_like);
app.delete('/posts', strictAuth, PostController.delete_post);


app.listen(process.env.PORT || 8000, () => {
    console.log('Server is started...');
});