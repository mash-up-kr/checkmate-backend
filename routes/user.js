const router = require('express').Router();

const conn = require('../config/mysql');
const config = require('../config/config');
const func = require('../config/function');

router.get('/:userId/work', function(req, res) {
  const sql = 'SELECT * FROM works WHERE user_id=?'
  conn.query(sql, [req.params.userId], function(err, results) {
    if(err) {
      console.log(err);
      res.status(500).json(config.status.sc500);
    } else {
      console.log('Response all work !');
      res.json(results);
    }
  });
});

router.post('/:userId/work', function(req, res) {
  func.workIdGenerator(req, req.params.userId, function(workId) {
    const work = {
      "id": workId,
      "user_id": req.params.userId,
      "name": req.body.name,
      "address": req.body.address,
      "latitude": req.body.latitude,
      "longitude": req.body.longitude,
      "hourly_wage": req.body.hourly_wage,
      "probation": req.body.probation,
      "recess": req.body.recess,
      "recess_state": req.body.recess_state,
      "pay_day": req.body.pay_day,
      "tax": req.body.tax
    };
    const sql = 'INSERT INTO works SET ?';
    conn.query(sql, work, function(err, results) {
      if(err) {
        console.log(err);
        res.status(500).json(config.status.sc500);
      } else {
        console.log('Add new work !');
        res.status(200).json(config.status.sc200);
      }
    });
  });
});

router.get('/:userId/work/:workId', function(req, res) {

});

router.put('/:userId/work/:workId', function(req, res) {

});

router.delete('/:userId/work/:workId', function(req, res) {

});

router.get('/:userId/work/:workId/main', function(req, res) {

});

router.post('/:userId/work/:workId/main', function(req, res) {

});

router.get('/:userId/work/:workId/main/detail', function(req, res) {

});

router.get('/:userId/work/:workId/main/calendar/:year/:month', function(req, res) {

});

router.get('/:userId/work/:workId/main/calendar/:year/:month/day', function(req, res) {

});


module.exports = router;