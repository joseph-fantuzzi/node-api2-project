// implement your posts router here

const express = require("express");

const router = express.Router();

const DB = require("./posts-model");

router.get("/", (req, res) => {
  DB.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((err) => {
      res.status(500).json({ message: "The posts information could not be retrieved" });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  DB.findById(id)
    .then((post) => {
      if (!post) {
        res.status(404).json({ message: "The post with the specified ID does not exist" });
      } else {
        res.status(200).json(post);
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "The post information could not be retrieved" });
    });
});

router.post("/", (req, res) => {
  const post = req.body;
  if (!post.title || !post.contents) {
    res.status(400).json({ message: "Please provide title and contents for the post" });
  } else {
    DB.insert(post)
      .then((newPost) => {
        DB.findById(newPost.id)
          .then((post) => {
            res.status(201).json(post);
          })
          .catch((err) => {
            res.status(500).json({ message: "The post information could not be retrieved" });
          });
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: "There was an error while saving the post to the database" });
      });
  }
});

module.exports = router;
