const { pool } = require('../../db');

const getTodos = (req, res) => {
  const userId = req.userId;

  const getTodos = `
    SELECT * FROM todos WHERE user_id=?`;

  pool.execute(getTodos, [userId], (error, result) => {
    if (error) {
      console.log(error);
      res.status(401).json("Du är inte inloggad");
    } else {
      res.status(200).json(result);
    }
  });
};

module.exports = { getTodos }