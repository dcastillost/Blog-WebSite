const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('useFindAndModify', false);

const mongooseOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true
}

const uri = "mongodb+srv://mongouser:FBsCDCVg1wiCMMhz@cluster0.5tp0i.mongodb.net/blogDB?retryWrites=true&w=majority";
// const localUrl = 'mongodb://localhost:27017/todoListDB'

mongoose.connect(uri, mongooseOptions);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Connected to DB");

});

// Mongoose Schemas and Models

// Posts
const postSchema = new mongoose.Schema({
  postTitle: String,
  postBody: String
});

const Post = new mongoose.model("Post", postSchema);


// Global variables and constants
const homeStartingContent = "This is my personal journal. I'm a 'self-taught' data scientist and web developer and I write mainly about those topics. I started this blog as a way to record my learning journey, but also to improve my communication skills, which I rarely use and are crucial in Data Science. There will also be the sporadic post about some of my hobbies, i.e. painting, beer, tea, literature, 日本語, etc...";
const aboutContent = "What should this page be about?";
const contactContent = "You can get in touch on this email.";


app.get("/", function(req, res) {

  Post.find({}, function(err, posts) {
    if (!err) {
      res.render("home", {
        homeStartingContent: homeStartingContent,
        posts: posts
      });
    }
  });

});

app.get("/about", function(req, res) {
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res) {
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.get("/posts/:postID", function(req, res) {
  // console.log(_.lowerCase(req.params.postName));
  Post.findOne({_id: req.params.postID}, function(err, post) {
    if (!err) {
      res.render("post", {
        postTitle: post.postTitle,
        postBody: post.postBody
      });
    }
  });

  // Post.find({}, function(err, posts) {
  //   if (!err) {
  //     posts.forEach(function(post){
  //       if (_.lowerCase(post.postTitle)  === _.lowerCase(req.params.postName)){
  //         // console.log("Post found.");
  //         res.render("post", {
  //           postTitle: post.postTitle,
  //           postBody: post.postBody
  //         });
  //       }
  //     });
  //   }
  // });
});

app.post("/compose", function(req, res) {
  const newPost = new Post({
    postTitle: req.body.postTitle,
    postBody: req.body.postBody
  });

  newPost.save(function(err) {
    if(!err) {
      res.redirect("/");
    }
  });
});





// Initialize server

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
