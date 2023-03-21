const bcrypt = require('bcrypt');
const { pool } = require('../../db');

const login = (req, res) => {
  const { username, password } = req.body;

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
          res.cookie("loginCookie", JSON.stringify({ userId: userId, username }), {
            maxAge: 20 * 60 * 1000,
            httpOnly: true,
          });
          res.status(200).json("Du är nu inloggad");
        }
      });
    }
  });
};

module.exports = { login };