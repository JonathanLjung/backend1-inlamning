const express = require('express');
const router = express.Router();

const { login } = require('./controllers/authController/loginController');
const { register } = require('./controllers/authController/registerController');
const { postTodos } = require('./controllers/todosController/postTodosController');
const { getTodos } = require('./controllers/todosController/getTodosController');
const { deleteTodos } = require('./controllers/todosController/deleteTodosController');
const { editTodos } = require('./controllers/todosController/editTodosController');
const { completeTodos } = require('./controllers/todosController/completeTodosController');

router.post("/register", register);

router.post("/login", login);

router.post("/todos", postTodos);

router.get("/todos", getTodos);

router.delete("/todos/:id", deleteTodos);

router.put("/todos/:id", editTodos);

router.put("/todos/:id/complete", completeTodos);

module.exports = router;