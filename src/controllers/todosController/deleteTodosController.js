const { pool } = require('../../db');

const deleteTodos = (req, res) => {
  const userId = req.userId;
  const todoId = req.params.id;

  const deleteTodo = `
    DELETE FROM todos WHERE id = ? AND user_id = ?`;

  pool.execute(deleteTodo, [todoId, userId], (error, result) => {
    if (error) {
      console.log(error);
      res.sendStatus(500);
    } else if (result.affectedRows === 0) {
      res.status(404).json("Ingen todo hittades att ta bort");
    } else {
      res.status(200).json("Din todo är nu borttagen");
    }
  });
};

module.exports = { deleteTodos }