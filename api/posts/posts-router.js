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

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const updatedPost = req.body;
  if (!updatedPost.title || !updatedPost.contents) {
    res.status(400).json({ message: "Please provide title and contents for the post" });
  } else {
    DB.update(id, updatedPost)
      .then((count) => {
        if (count !== 1) {
          res.status(404).json({ message: "The post with the specified ID does not exist" });
        } else {
          DB.findById(id)
            .then((post) => {
              res.status(200).json(post);
            })
            .catch((err) => {
              res.status(500).json({ message: "The post information could not be retrieved" });
            });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: "The post information could not be modified" });
      });
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  let deletedPost;
  DB.findById(id)
    .then((post) => {
      deletedPost = post;
    })
    .catch((err) => {
      res.status(500).json({ message: "The post information could not be retrieved" });
    });
  DB.remove(id)
    .then((number) => {
      if (number !== 1) {
        res.status(404).json({ message: "The post with the specified ID does not exist" });
      } else {
        res.status(200).json(deletedPost);
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "The post could not be removed" });
    });
});

router.get("/:id/comments", (req, res) => {
  const { id } = req.params;
  DB.findPostComments(id)
    .then((comments) => {
      if (comments.length === 0) {
        DB.findById(id)
          .then((post) => {
            if (!post) {
              res.status(404).json({ message: "The post with the specified ID does not exist" });
            } else {
              res.status(404).json({ message: "The post was found but has no comments" });
            }
          })
          .catch((err) => {
            res.status(500).json({ message: "The post information could not be retrieved" });
          });
      } else {
        res.status(200).json(comments);
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "The comments information could not be retrieved" });
    });
});

module.exports = router;
