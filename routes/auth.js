const router = require('express').Router();

const conn = require('../config/mysql');
const config = require('../config/config');

router.post('/login', function(req, res) {
  const user = {
    "id": req.body.id,
    "nickname": req.body.nickname,
    "email": req.body.email
  };
  const sql = 'SELECT * FROM users WHERE id=?';
  conn.query(sql, [user.id], function(err, results) {
    if(err) {
      console.log(err);
      res.status(500).json(config.status.sc500);
    } else if(results.length === 0) {
      console.log('New user access !');
      const sql = 'INSERT INTO users SET ?';
      conn.query(sql, user, function(err, results) {
        if(err) {
          console.log(err);
          res.status(500).json(config.status.sc500);
        } else {
          console.log('Add new user !');
          res.status(200).json(config.status.sc200);
        }
      });
    } else {
      console.log('Existing user access !');
      res.status(200).json(config.status.sc200);
    }
  });
});

module.exports = router;