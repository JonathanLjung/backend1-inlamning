const { pool } = require('../../db');
const joi = require("joi");

const schema = joi.object({
  user_id: joi.number()
  .integer()
  .min(1)
  .required()
});

const getTodos = (req, res) => {
  const { error, value } = schema.validate({ user_id: req.userId });

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { user_id } = value;

  const getTodosQuery = `
    SELECT * FROM todos WHERE user_id=?`;

  pool.execute(getTodosQuery, [user_id], (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).json("Ett internt fel uppstod");
    } else {
      res.status(200).json(result);
    }
  });
};

module.exports = { getTodos };