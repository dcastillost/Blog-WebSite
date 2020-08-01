//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "This is my personal journal. I'm a 'self-taught' data scientist and web developer and I write mainly about those topics. I started this blog as a way to record my learning journey, but also to improve my communication skills, which I rarely use and are crucial in Data Science. There will also be the sporadic post about some of my hobbies, i.e. painting, beer, tea, literature, 日本語, etc...";
const aboutContent = "What should this page be about?";
const contactContent = "You can get in touch on this email.";

// Global variables and constants
const posts = [ {
  postTitle: "First Post",
  postBody: "I have decided to start a blog to keep track of the progress of my learning journey."
  },
  {
  postTitle: "Second Post",
  postBody: "Yesterday I continued the Python for Financial analysis and Algorithmic trading course and started learning command line commands."
}];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.render("home", {
    homeStartingContent: homeStartingContent,
    posts:posts
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

app.post("/compose", function(req, res) {
  const newPost = {
    postTitle: req.body.postTitle,
    postBody: req.body.postBody
  };
  posts.push(newPost);
  res.redirect("/");
});

app.get("/posts/:postName", function(req, res) {
  // console.log(_.lowerCase(req.params.postName));
  posts.forEach(function(post){
    if (_.lowerCase(post.postTitle)  === _.lowerCase(req.params.postName)){
      // console.log("Post found.");
      res.render("post", {
        postTitle: post.postTitle,
        postBody: post.postBody
      });
    }
  });
});






app.listen(3000, function() {
  console.log("Server started on port 3000");
});
