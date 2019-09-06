const express = require('express');
// const cors = require('cors');

const server = express();

server.use(express.json());
// server.use(cors);
server.use(logger);

const port = process.env.PORT || 8000;

server.listen(port, () => console.log(`server listening on port ${port}`));


function logger(req,res,next) {
  const date = new Date();
  console.log(`request method : ${req.method} request url: ${req.hostname}:${port}${req.url} timestamp: ${date.getDay()}` )
  next();
}

module.exports = server;