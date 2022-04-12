// implement your server here
// require your posts router and connect it here

const express = require("express");

const server = express();

server.get("/", (req, res) => {
  res.send("It is working");
});

module.exports = server;
