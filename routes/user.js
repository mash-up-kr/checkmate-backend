const router = require('express').Router();

const conn = require('../config/mysql');
const config = require('../config/config');
const func = require('../config/function');

router.get('/:userId/work', (req, res) => {
  const sql = 'SELECT * FROM works WHERE user_id=?';
  conn.query(sql, [req.params.userId], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json(config.status.sc500);
    } else {
      console.log('Response all work !');
      res.json(results);
    }
  });
});

router.post('/:userId/work', (req, res) => {
  func.workIdGenerator(res, req.params.userId, (workId) => {
    const work = {
      id: workId,
      user_id: req.params.userId,
      name: req.body.name,
      address: req.body.address,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      hourly_wage: req.body.hourly_wage,
      probation: req.body.probation,
      recess: req.body.recess,
      recess_state: req.body.recess_state,
      pay_day: req.body.pay_day,
      tax: req.body.tax,
      five_state: req.body.five_state,
      working_day: req.body.working_day,
    };
    const sql = 'INSERT INTO works SET ?';
    conn.query(sql, work, (err) => {
      if (err) {
        console.log(err);
        res.status(500).json(config.status.sc500);
      } else {
        console.log('Add new work !');
        res.status(200).json(config.status.sc200);
      }
    });
  });
});

router.get('/:userId/work/:workId', (req, res) => {
  const sql = 'SELECT * FROM works WHERE id=?';
  conn.query(sql, [req.params.workId], (err, results) => {
    if (err || results.length === 0 || results.length > 1) {
      console.log(err);
      res.status(500).json(config.status.sc500);
    } else {
      console.log('Response a single work !');
      res.json(results[0]);
    }
  });
});

router.put('/:userId/work/:workId', (req, res) => {
  const sql = 'UPDATE works SET name=?, address=?, latitude=?, longitude=?, hourly_wage=?, probation=?, recess=?, recess_state=?, pay_day=?, tax=?, five_state=?, working_day=? WHERE id=?';
  const params = [req.body.name, req.body.address, req.body.latitude, req.body.longitude, req.body.hourly_wage, req.body.probation, req.body.recess, req.body.recess_state, req.body.pay_day, req.body.tax, req.body.five_state, req.body.working_day, req.params.workId];
  conn.query(sql, params, (err) => {
    if (err) {
      console.log(err);
      res.status(500).json(config.status.sc500);
    } else {
      console.log('Update a single work !');
      res.status(200).json(config.status.sc200);
    }
  });
});

router.delete('/:userId/work/:workId', (req, res) => {
  const sql = 'DELETE FROM works WHERE id=?';
  conn.query(sql, [req.params.workId], (err) => {
    if (err) {
      console.log(err);
      res.status(500).json(config.status.sc500);
    } else {
      console.log('Delete a single work !');
      res.status(200).json(config.status.sc200);
    }
  });
});

// router.get('/:userId/work/:workId/main', (req, res) => {

// });

router.post('/:userId/work/:workId/main', (req, res) => {
  const timestamp = {
    user_id: req.params.userId,
    work_id: req.params.workId,
  };
  const sql = 'INSERT INTO timestamps SET ?';
  conn.query(sql, timestamp, (err) => {
    if (err) {
      console.log(err);
      res.status(500).json(config.status.sc500);
    } else {
      console.log('Add new timestamp !');
      console.log(`working_state : ${req.body.working_state}`);
      res.status(200).json(config.status.sc200);
    }
  });
});

// router.get('/:userId/work/:workId/main/detail', (req, res) => {

// });

router.get('/:userId/work/:workId/main/calendar/:year/:month', (req, res) => {
  const sql = "SELECT date_format(date, '%y-%m-%d') date, daily_wage FROM work_records WHERE work_id=? AND date>? AND date<?";
  func.monthZeroFillGenerator(req.params.year, req.params.month, (result1, result2) => {
    conn.query(sql, [req.params.workId, result1, result2], (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json(config.status.sc500);
      } else {
        console.log('Check monthly calendar !');
        res.json(results);
      }
    });
  });
});

// router.get('/:userId/work/:workId/main/calendar/:year/:month/day', (req, res) => {

// });


module.exports = router;
