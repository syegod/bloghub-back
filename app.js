import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { UserController } from './controllers/index.js';
import checkAuth from './utils/checkAuth.js';
import connectdb from './db/connectdb.js';
config();

const app = express();
app.use(cors());
app.use(express.json());
connectdb();

app.post('/auth/register', UserController.register);
app.post('/auth/login', UserController.login);
app.get('/auth/get-me', checkAuth, UserController.getMe);
app.get('/auth/get-all-users', UserController.getAllUsers);

app.listen(process.env.PORT || 8000, () => {
    console.log('Server is started...');
});