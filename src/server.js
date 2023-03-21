const express = require("express");
const server = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require('./router');
const port = 5050;
const { getUserIdFromCookie } = require('./middlewares/getUserIdFromCookies')

require("dotenv").config();

server.use(cookieParser());

server.use(express.json());

server.use(getUserIdFromCookie);


server.use(
  cors({
    origin: 
[
    "http://localhost:5050",
    "http://localhost:5500",
    "http://127.0.0.1:5500"
],
    credentials: true,
  })
);

server.use(express.static("public"));

server.use('/', router);

server.listen(port);
console.log(`Server listening to port:${port}`);
