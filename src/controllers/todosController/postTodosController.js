const { pool } = require('../../db');

const joi = require("joi");

const postTodosSchema = joi.object({
  title: joi.string().min(2).max(100).required(),
  description: joi.string().min(2).max(500).required()
});

const postTodos = (req, res) => {
  const { title, description } = req.body;
  const user_id = req.userId;

  if (!user_id) {
    res.status(401).json("Användaren är inte inloggad");
    return;
  }

  const { error, value } = postTodosSchema.validate({ title, description });

  if (error) {
    res.status(400).json({ error: error.details[0].message });
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
