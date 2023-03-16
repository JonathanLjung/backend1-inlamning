const { pool } = require('../../db');

const editTodos = (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const updateTodo = `
    UPDATE todos
    SET title=?, description=?
    WHERE id=?`;

  pool.execute(updateTodo, [title, description, id], (error, result) => {
    if (error) {
      console.log(error);
      res.sendStatus(500);
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Todo not found" });
    } else {
      res.status(200).json("Din todo är nu uppdaterad");
    }
  });
};

module.exports = { editTodos }