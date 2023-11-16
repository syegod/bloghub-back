import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../db/models.js';
import { config } from 'dotenv';
config();

export async function register(req, res) {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Credentials required.' });
        }
        const candidateEmail = await User.findOne({ email });
        const candidateUname = await User.findOne({ username });
        if (candidateEmail) {
            return res.status(400).json({ message: 'User with same email already exists.' });
        }
        if (candidateUname) {
            return res.status(400).json({ message: 'User with same username already exists.' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ username, email, passwordHash: hashedPassword });
        await user.save();
        const token = jwt.sign({
            _id: user._doc._id
        }, process.env.JWT_SECRET, {
            expiresIn: '3d'
        });
        const { passwordHash, ...userData } = user._doc;
        return res.status(201).json({ userData, token, message: 'User successfully registered.' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message || 'Internal server error.' });
    }
}

export async function login(req, res) {
    try {
        const { login, password } = req.body;
        if (!login || !password) {
            return res.status(400).json({ message: 'Credentials required.' });
        }
        const candidate = await User.findOne({ username: login }) || await User.findOne({ email: login });
        if (!candidate) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const passCompare = await bcrypt.compare(password, candidate.passwordHash);
        if (!passCompare) {
            return res.status(400).json({ message: 'Credentials required.' });
        }
        const token = jwt.sign({
            _id: candidate._doc._id
        }, process.env.JWT_SECRET, {
            expiresIn: '3d'
        });
        const { passwordHash, ...userData } = candidate._doc;
        return res.json({ userData, token, message: 'Logged in.' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message || 'Internal server error.' });
    }
}

export async function getMe(req, res) {
    try {
        const { userId } = req;
        const user = await User.findById(userId).populate('posts');
        if (!user) {
            return res.status(404).json({ message: 'User not found or has been deleted.' });
        }
        const token = jwt.sign({
            _id: user._doc._id
        }, process.env.JWT_SECRET, {
            expiresIn: '3d'
        });
        const { passwordHash, ...userData } = user._doc;
        return res.json({ userData, token });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message || 'No access.' });
    }
}

export async function getAllUsers(req, res) {
    try {
        const users = await User.find().select('-passwordHash');
        return res.json(users);
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: err.message || 'Internal server error.' })
    }
}
