import { v2 as cloudinary } from 'cloudinary';
import { User, Post } from '../db/models.js';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
config();

export async function create_post(req, res) {
    try {
        const { text, file_name } = req.body;
        const { userId } = req;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Not authenticated.' });
        }

        const newPost = new Post({
            text,
            date: new Date(),
            author: user._id
        });

        // if(fs.existsSync(`.`+imagepath)){
        //     console.log('exists');
        //     const {url} = await cloudinary.uploader.upload(`.`+imagepath, {
        //         public_id: `bloghub/posts/${newPost._id}`
        //     });
        //     newPost.image = url;
        //     fs.rm(`.`+imagepath, (e) => console.log(e));
        // }
        if (fs.existsSync(`./static/`+file_name)) {
            const { url } = await cloudinary.uploader.upload(`./static/`+file_name, {
                public_id: `bloghub/posts/${newPost._id}`
            });
            newPost.image = url;
            fs.rm(`./static/`+file_name, e => console.log(e));
        }
        user.posts.push(newPost._id);

        await newPost.save();
        await user.save();

        return res.status(201).json({ newPost });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message || 'Internal server error.' });
    }
}

export async function get_posts(req, res) {
    try {
        const { userId } = req;
        const user = await User.findById(userId);
        let posts = await Post.find().sort('-createdAt').populate('author', '-passwordHash');
        if (user) {
            const postIds = posts.map(post => post._id);
            const postsToUpdate = posts.filter(post => !post.views.includes(user._id));
            if (postsToUpdate.length > 0) {
                await Post.updateMany(
                    { _id: { $in: postIds } },
                    { $push: { views: user._id } }
                );
                posts = await Post.find({ _id: { $in: postIds } }).sort('-createdAt').populate('author', '-passwordHash');
            }
        }
        return res.json(posts);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message || 'Internal server error.' });
    }
}

export async function handle_like(req, res) {
    try {
        const { postId } = req.body;
        const { userId } = req;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'Not authenticated.' });
        }
        const post = await Post.findById(postId).populate('author');
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        if (post.likes.includes(user._id)) {
            const likeIndex = post.likes.indexOf(user._id);
            post.likes.splice(likeIndex, 1);
        } else {
            post.likes.push(user._id);
        }
        await post.save();
        return res.status(202).json(post);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message || 'Internal server error.' });
    }
}

export async function test(req, res) {
    try {
        const { image } = req.body;
        return res.json(req.body);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message || 'Internal server error.' });
    }
}
