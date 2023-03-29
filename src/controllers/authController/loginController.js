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

const login = (req, res) => {
  const { error, value } = schema.validate(req.body);

  if (error) {
    const errorMessage = error.details[0].message;
    return res.status(400).json({ error: errorMessage });
  }

  const { username, password } = value;

  const getUserData = `
    SELECT id, password FROM users WHERE BINARY username=?`;

  pool.execute(getUserData, [username], (error, result) => {
    if (error) {
      console.log(error);
      res.sendStatus(500);
    } else if (result.length === 0) {
      res.status(401).json({ error: "Fel användarnamn eller lösenord" });
    } else {
      const userId = result[0].id;
      const storedPassword = result[0].password;

      bcrypt.compare(password, storedPassword, (err, isMatch) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else if (!isMatch) {
          res.status(401).json({ error: "Fel användarnamn eller lösenord" });
        } else {
          res.cookie(
            "loginCookie",
            JSON.stringify({ userId: userId, username }),
            {
              maxAge: 20 * 60 * 1000,
              httpOnly: true,
            }
          );
          res.status(200).json("Du är nu inloggad");
        }
      });
    }
  });
};

module.exports = { login };
