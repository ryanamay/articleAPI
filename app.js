const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

// set view engine
app.set("view engine", "ejs");

// use bodyparser
app.use(express.urlencoded({ extended: true }));

// set up static sites
app.use(express.static("public"));

// connect to mongodb
mongoose.connect("mongodb://localhost:27017/wikiDB");

// create a schema
const articleSchema = {
  title: String,
  content: String,
};

// create a new model
const Article = new mongoose.model("Article", articleSchema);

//////////// REQUESTS TARGETING ALL ARTICLES ////////////

app
  .route("/articles")
  .get((req, res) => {
    Article.find((err, foundArticles) => {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save((err) => {
      if (!err) {
        res.send("Successfully added new article!");
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("Successfully deleted all articles!");
      } else {
        res.send(err);
      }
    });
  });

//////////// REQUESTS TARGETING ONE ARTICLE ////////////

app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching that title was found.");
      }
    });
  })
  .put((req, res) => {
    Article.replaceOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      (err) => {
        if (!err) {
          res.send("Successfully updated the article!");
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch((req, res) => {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body },
      (err) => {
        if (!err) {
          res.send("Successfully updated the article!");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, (err) => {
      if (!err) {
        res.send("Successfully deleted the article!");
      } else {
        res.send(err);
      }
    });
  });

// listen on port 3000
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
