const { pool } = require('../../db');

const postTodos = (req, res) => {
  const { title, description } = req.body;
  const user_id = req.user.userId;

  if (!user_id) {
    res.status(401).json("Användaren är inte inloggad");
    return;
  }

  const insertTodo = `
    INSERT INTO todos (user_id, title, description)
    VALUES (?, ?, ?)`;

  pool.execute(insertTodo, [user_id, title, description], (error, result) => {
    if (error) {
      console.log(error);
      res.sendStatus(500);
    } else {
      res.status(201).json("Todo added.");
    }
  });
};

module.exports = { postTodos };