const bcrypt = require('bcrypt');
const { pool } = require('../../db');

const joi = require('joi');

const schema = joi.object({
  username: joi.string()
    .min(3)
    .max(25)
    .required()
    .messages({
      "string.min": "Användarnamnet måste vara minst 3 tecken",
      "string.max": "Användarnamnet får inte vara längre än 25 tecken",
      "any.required": "Användarnamn är obligatoriskt",
    }),
  password: joi.string()
    .min(6)
    .max(30)
    .required()
    .messages({
      "string.min": "Lösenordet måste vara minst 6 tecken",
      "string.max": "Lösenordet får inte vara längre än 30 tecken",
      "any.required": "Lösenord är obligatoriskt",
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
      res.status(409).json({ error: "Användarnamnet finns redan" });
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
                res.status(201).json("Ny användare registrerad.");
              }
            }
          );
        }
      });
    }
  });
};

module.exports = { register };