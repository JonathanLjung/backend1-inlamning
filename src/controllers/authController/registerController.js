const bcrypt = require('bcrypt');
const { pool } = require('../../db');

const register = (req, res) => {
  const { username, password } = req.body;

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