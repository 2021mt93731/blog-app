const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose')

const app = express();
app.use(bodyParser.json());
app.use(cors());

//const posts = {};

main().catch(err => console.log(err));
async function main() {
    // Connect to MongoDB  
    await mongoose.connect('mongodb://localhost:27017/posts-db');
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

// Create a schema for a todo item
const postSchema = new mongoose.Schema({
    title: String
});

// Create a model based on the schema
const Post = mongoose.model('Post', postSchema);


app.get('/posts', (req, res) => {

    // // with local object
    // // *************************************/
    // res.send(posts);
    // // *************************************/

    // with database
    /*************************************/
    Post.find((err, posts) => {
        if (err) {
            res.status(500).send({ error: 'Error retrieving posts' });
        } else {
            res.send(posts);
        }
    });
    /*************************************/
});

app.post('/posts/create', async (req, res) => {

    // // with local object  
    // /*************************************/
    //const id = randomBytes(4).toString('hex');
    //const { title } = req.body;
    // posts[id] = {
    //     id, title
    // };

    // await axios.post('http://event-bus-srv:4005/events', {
    //     //await axios.post('http://localhost:4005/events', {
    //     type: 'PostCreated',
    //     data: { id, title }
    // }).catch((err) => {
    //     console.log(err.message);
    // })
    // console.log(posts);
    // res.status(201).send(posts[id]);
    // /*************************************/

    // with database
    /*************************************/
    try {
        // Create a new user using the request body
        const post = await Post.create({
            title: req.body.title
        });

        //await axios.post('http://event-bus-srv:4005/events', {
        await axios.post('http://localhost:4005/events', {
            type: 'PostCreated',
            data: { id: post._id, title: post.title }
        }).catch((err) => {
            console.log(err.message);
        })

        res.status(201).send(post);

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
    /*************************************/

});

app.post('/events', (req, res) => {
    console.log('Received Event', req.body.type);
    res.send({});

});

app.listen(4000, () => {
    console.log('v4');
    console.log('listening on 4000');
});