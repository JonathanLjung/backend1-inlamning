const { pool } = require('../../db');

const completeTodos = (req, res) => {
  const { id } = req.params;
  const { isComplete } = req.body;

  const updateTodoQuery = `
  UPDATE todos
  SET complete = ?
  WHERE id = ? AND user_id = ?`;

  pool.execute(
    updateTodoQuery,
    [isComplete, id, req.userId],
    (error, result) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: "Kunde inte hitta To-do" });
      } else {
        res.json({ success: true });
      }
    }
  );
};

module.exports = { completeTodos };