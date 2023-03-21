const { pool } = require('../../db');

const getTodos = (req, res) => {
  const user_id = req.userId;

  const getTodos = `
    SELECT * FROM todos WHERE user_id=?`;

    if (user_id !== undefined) {
  pool.execute(getTodos, [user_id], (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).json("Du är inte inloggad");
    } else {
      res.status(200).json(result);
    }
  });
}};

module.exports = { getTodos }