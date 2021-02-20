const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {}

const handleEvent = (type, data) => {
        if (type === 'PostCreated') {
        const { id, title } = data
        posts[id] = { id, title, comments: [] } 
    } 
    else if (type === 'CommentCreated') {
        const { id, content, postId, status } = data 
        const post = posts[postId]
        post.comments.push({ id, content, status })
    }
    else if (type === 'CommentUpdated') {
        const { id, content, postId, status } = data;
        const post = posts[postId];
        const comment = post.comments.find(comment => {
            return comment.id === id;
        });
        comment.status = status;
        comment.content = content;
    }
}

// ENDPOINTS 

// ------------- listens for posts & comments from event bus -------------- //
app.get('/posts', (req, res) => {
    // listens for anytime someone makes a request to /posts
    // return all posts & related comments
    res.send(posts);
});

// ------------- listens for events from event bus -------------- //
app.post('/events', (req, res) => {
    const { type, data } = req.body; 
    handleEvent(type, data);
    res.send({});
});

// LOCAL SERVER 

app.listen(4002, async () => {
  console.log('Listening on 4002 - query service');                 // 4002
  const res = await axios.get('http://event-bus-srv:4005/events');
  for (let event of res.data) { // w/ axios, the response's data is on the .data property
    console.log('Procesing event: ', event.type)
    handleEvent(event.type, event.data);
  }
});

// app.listen(4002, () => {
//   console.log('Listening on 4002 - query service');                 // 4002
//   axios.get('http://event-bus-srv:4005/events').then((res) => {
//     for (let event of res.data) { // w/ axios, the response's data is on the .data property
//         console.log('Procesing event: ', event.type)
//         handleEvent(event.type, event.data);
//     }
//   }).catch((err) => {
//     console.log('--------- ERROR ----------');
//     console.log(error);
//     console.log('--------------------------');
//     return error;
//   })
// });
