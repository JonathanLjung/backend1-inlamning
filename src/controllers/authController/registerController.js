const bcrypt = require('bcrypt');
const { pool } = require('../../db');

const joi = require('joi');

const schema = joi.object({
  username: joi.string()
    .min(3)
    .max(25)
    .required()
    .messages({
      "string.min": "Username must contain atleast 3 characters",
      "string.max": "Username cannot exceed 25 characters",
      "any.required": "Username is mandatory",
    }),
  password: joi.string()
    .min(6)
    .max(30)
    .required()
    .messages({
      "string.min": "Password must contain atleast 6 characters",
      "string.max": "Password cannot exceed 30 characters",
      "any.required": "Password is mandatory",
    }),
});

const register = (req, res) => {
  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { username, password } = value;

  const checkUsername = `
    SELECT username FROM users WHERE BINARY username=?`;

  pool.execute(checkUsername, [username], (error, result) => {
    if (error) {
      console.log(error);
      res.sendStatus(500);
    } else if (result.length > 0) {
      res.status(409).json({ error: "Username is already in use" });
    } else {
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          const insertUser = `
            INSERT INTO users(username, password)
            VALUES(?, ?)`;

          pool.execute(
            insertUser,
            [username, hashedPassword],
            (error, result) => {
              if (error) {
                console.log(error);
                res.sendStatus(500);
              } else {
                res.status(201).json("New user registered.");
              }
            }
          );
        }
      });
    }
  });
};

module.exports = { register };