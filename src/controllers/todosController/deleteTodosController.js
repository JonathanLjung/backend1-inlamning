const { pool } = require('../../db');
const joi = require('joi');

const deleteTodoSchema = joi.object({
  id: joi.number().integer().required(),
});

const deleteTodos = (req, res) => {
  const user_id = req.userId;
  const { error, value } = deleteTodoSchema.validate(req.params, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    res.status(400).json({ error: errors });
    return;
  }

  const { id } = value;

  const deleteTodo = `
    DELETE FROM todos WHERE id = ? AND user_id = ?`;

  pool.execute(deleteTodo, [id, user_id], (error, result) => {
    if (error) {
      console.log(error);
      res.sendStatus(500);
    } else if (result.affectedRows === 0) {
      res.status(404).json("No todo was found");
    } else {
      res.status(200).json("Your todo was removed successfully");
    }
  });
};

module.exports = { deleteTodos }