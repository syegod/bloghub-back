import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();

export default function checkAuth(req, res, next) {
    const token = (req.headers.authorization || '').replace(/Bearer\s/, '');
    if (token) {
        try {
            const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = verifiedToken._id;
            next();
        } catch (err) {
            console.log(err.message);
            return res.status(403).json({
                message: 'Not authenticated.'
            });
        }
    } else {
        return res.status(403).json({
            message: 'Not authenticated.'
        });
    }
}