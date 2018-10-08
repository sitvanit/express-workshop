/** server **/
// Servers are computer programs that receive requests from other programs, the clients and send back a response e.g
// share data, information or hardware and software resources.
// A server is a computer program. Its job is to send and receive data.

const fs = require('fs');
const express = require('express');
const formidable = require('express-formidable');
const beautify = require("json-beautify");

const app = express();
const port = 3000;

/** static files **/
// Things like HTML files, images etc are known as static assets. If you want your server to "serve" static assets back
// to the browser, you need to do something different than just using the res.send() method.
// To be able to send any file from the server we need a special, built-in middleware function that comes with Express:
app.use(express.static('public'));
app.use(express.static('data'));

/** parsing the body of the request **/
app.use(formidable());

/** Rendering a template **/
app.set('view engine', 'mustache');
app.set('views', './views');

/** handle function **/
// When a request reaches the server, we need a way of responding to it. In comes the handler function. The handler
// function is just a function which receives requests and handles them, hence the name.
// The handler function always takes a request and response object, and sends the response back to the client along with
// some information. You can decide what to send back in your response.

// root
// app.get('/', function(req, res) {
//     res.send('hello world');
// });

/** endpoint **/
// An endpoint is the part of the URL which comes after /. For example: /chocolate is the "chocolate" endpoint. It's
// the URL to which you send a request.
// app.get('/chocolate', function(res, res) {
//     res.send('Mmmm... chocolate :o')
// });

app.post('/create-post', function (req, res) {
    console.log(req.fields); // req.fields existing due to the formidable
    let posts;

    try {
        posts = JSON.parse(fs.readFileSync('./data/posts.json'));
        posts[Date.now()] = req.fields.blogpost;
    } catch (error) {
        throw new Error(`Error occurred while trying to read the file: ${error}`);
    }

    fs.writeFile('./data/posts.json', beautify(posts, null, 2, 100), function (error) {
        if (error) {
            throw new Error(`Error occurred while trying to write to the file: ${error}`);
        }
    });
});

app.get('/get-posts', function (req, res) {
    res.sendFile(__dirname + '/data/posts.json');
});

app.get('/posts/:postId', function (req, res) {
    res.send('post id: ' + req.params.postId);
});

app.listen(port, function() {
    console.log(`server is listening on port ${port}`);
});

