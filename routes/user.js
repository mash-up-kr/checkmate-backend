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

router.get('/:userId/work/:workId/main', (req, res) => {
  func.baseDayCalculator((baseDay) => {
    func.totalDayCalculator(res, req.params.workId, (totalDay) => {
      func.firstAndLastDateCalculator(res, req.params.workId, (result1, result2) => {
        const sql = 'SELECT SUM(daily_wage) totalMoney, SUM(working_hour) totalHour, hourly_wage FROM work_records WHERE work_id=? AND date>=? AND date<=?';
        conn.query(sql, [req.params.workId, result1, result2], (err, results) => {
          if (err) {
            console.log(err);
            res.status(500).json(config.status.sc500);
          } else {
            const result = {
              base_day: baseDay,
              total_day: totalDay,
              total_money: results[0].totalMoney,
              total_hour: results[0].totalHour,
              hourly_wage: results[0].hourly_wage,
            };
            console.log('Check main page !');
            res.json(result);
          }
        });
      });
    });
  });
});

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

router.get('/:userId/work/:workId/main/detail', (req, res) => {
  const sql = 'SELECT SUM(daily_wage) totalMoney, SUM(working_hour) totalHour, hourly_wage, '
              + 'SUM(weekly_holiday_allowance) weeklyHolidayAllowance, SUM(night_allowance) nightAllowance, '
              + 'SUM(holiday_allowance) holidayAllowance, SUM(overtime_pay) overtimePay FROM work_records WHERE work_id=? AND date>=? AND date<=?';
  func.firstAndLastDateCalculator(res, req.params.workId, (result1, result2) => {
    conn.query(sql, [req.params.workId, result1, result2], (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json(config.status.sc500);
      } else {
        const result = {
          total_money: results[0].totalMoney,
          total_hour: results[0].totalHour,
          hourly_wage: results[0].hourly_wage,
          weekly_holiday_allowance: results[0].weeklyHolidayAllowance,
          night_allowance: results[0].nightAllowance,
          holiday_allowance: results[0].holidayAllowance,
          overtime_pay: results[0].overtimePay,
        };
        console.log('Check detail main page !');
        res.json(result);
      }
    });
  });
});

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

router.get('/:userId/work/:workId/main/calendar/:year/:month/:day', (req, res) => {
  const sql = "SELECT date_format(timestamp, '%y-%m-%d %h:%m:%s') timestamp FROM timestamps WHERE work_id=? AND timestamp>? AND timestamp<?";
  func.dayZeroFillGenerator(req.params.year, req.params.month, req.params.day, (result1, result2) => {
    conn.query(sql, [req.params.workId, result1, result2], (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json(config.status.sc500);
      } else {
        const timestamps = results;
        const sql2 = 'SELECT * FROM work_records WHERE work_id=? AND date=?';
        conn.query(sql2, [req.params.workId, result1], (err2, results2) => {
          if (err2) {
            console.log(err);
            res.status(500).json(config.status.sc500);
          } else {
            const result = {
              daily_wage: results2[0].daily_wage,
              hourly_wage: results2[0].hourly_wage,
              working_hour: results2[0].working_hour,
              time: timestamps,
              night_allowance: results2[0].night_allowance,
              holiday_allowance: results2[0].holiday_allowance,
              overtime_pay: results2[0].overtime_pay,
              weekly_holiday_allowance: results2[0].weekly_holiday_allowance,
            };
            console.log('Check daily calendar !');
            res.json(result);
          }
        });
      }
    });
  });
});

module.exports = router;
