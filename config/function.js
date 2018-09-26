const conn = require('./mysql');
const config = require('./config');

module.exports = {
  workIdGenerator(res, userId, callback) {
    let id = `WO${userId}A`;
    const sql = "SELECT COUNT(*) AS 'count' FROM works WHERE user_id=?";
    conn.query(sql, [userId], (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json(config.status.sc500);
      } else {
        id += `${results[0].count}`;
        callback(id);
      }
    });
  },
  baseDayCalculator(callback) {
    const beforeDate = new Date();
    const afterDate = (beforeDate.getMonth() > 0) ? new Date(beforeDate.getFullYear(), beforeDate.getMonth(), 0) : new Date(beforeDate.getFullYear() - 1, 12, 0);
    const baseDay = afterDate.getDate();
    callback(baseDay);
  },
  totalDayCalculator(res, workId, callback) {
    const sql = 'SELECT pay_day FROM works WHERE id=?';
    conn.query(sql, [workId], (err, results) => {
      if (err || results.length === 0) {
        console.log(err);
        res.status(500).json(config.status.sc500);
      } else {
        const today = new Date();
        const beforePayDay = (today.getMonth() > 0) ? new Date(today.getFullYear(), today.getMonth(), results[0].pay_day + 1) : new Date(today.getFullYear() - 1, 12, results[0].pay_day + 1);
        let diffDate1 = beforePayDay instanceof Date ? beforePayDay : new Date(beforePayDay);
        let diffDate2 = today instanceof Date ? today : new Date(today);
        diffDate1 = new Date(diffDate1.getFullYear(), diffDate1.getMonth() + 1, diffDate1.getDate());
        diffDate2 = new Date(diffDate2.getFullYear(), diffDate2.getMonth() + 1, diffDate2.getDate());
        let totalDay = Math.abs(diffDate2.getTime() - diffDate1.getTime());
        totalDay = Math.ceil(totalDay / (1000 * 3600 * 24));
        callback(totalDay);
      }
    });
  },
  monthZeroFillGenerator(year, month, callback) {
    let result1 = `${year}-`;
    let result2 = `${year}-`;
    if (month < 9) {
      result1 += `0${month}-00`;
      result2 += `0${parseInt(month, 10) + 1}-00`;
    } else if (month === 9) {
      result1 += `0${month}-00`;
      result2 += `${parseInt(month, 10) + 1}-00`;
    } else if (month < 12) {
      result1 += `${month}-00`;
      result2 += `${parseInt(month, 10) + 1}-00`;
    } else if (month === 12) {
      result1 += `${month}-00`;
      result2 = `${parseInt(year, 10) + 1}-01-00`;
    }
    callback(result1, result2);
  },
  dayZeroFillGenerator(year, month, day, callback) {
    let result1 = new Date(year, month, day);
    let result2 = new Date(Date.parse(result1) + 1 * 1000 * 60 * 60 * 24);
    const month1 = `0${result1.getMonth()}`;
    const day1 = `0${result1.getDate()}`;
    const month2 = `0${result2.getMonth()}`;
    const day2 = `0${result2.getDate()}`;
    result1 = `${result1.getFullYear()}-${month1.slice(-2)}-${day1.slice(-2)}`;
    result2 = `${result2.getFullYear()}-${month2.slice(-2)}-${day2.slice(-2)}`;
    callback(result1, result2);
  },
  firstAndLastDateCalculator(res, workId, callback) {
    const sql = 'SELECT pay_day FROM works WHERE id=?';
    const today = new Date();
    conn.query(sql, [workId], (err, results) => {
      if (err || results.length === 0) {
        console.log(err);
        res.status(500).json(config.status.sc500);
      } else if (results[0].pay_day >= today.getDate()) {
        const beforePayDay = (today.getMonth() > 0) ? new Date(today.getFullYear(), today.getMonth(), results[0].pay_day + 1) : new Date(today.getFullYear() - 1, 12, results[0].pay_day + 1);
        const month1 = `0${beforePayDay.getMonth()}`;
        const day1 = `0${beforePayDay.getDate()}`;
        const month2 = `0${today.getMonth() + 1}`;
        const day2 = `0${today.getDate()}`;
        const result1 = `${beforePayDay.getFullYear()}-${month1.slice(-2)}-${day1.slice(-2)}`;
        const result2 = `${today.getFullYear()}-${month2.slice(-2)}-${day2.slice(-2)}`;
        callback(result1, result2);
      } else {
        const beforePayDay = new Date(today.getFullYear(), today.getMonth() + 1, results[0].pay_day + 1);
        const month1 = `0${beforePayDay.getMonth()}`;
        const day1 = `0${beforePayDay.getDate()}`;
        const month2 = `0${today.getMonth() + 1}`;
        const day2 = `0${today.getDate()}`;
        const result1 = `${beforePayDay.getFullYear()}-${month1.slice(-2)}-${day1.slice(-2)}`;
        const result2 = `${today.getFullYear()}-${month2.slice(-2)}-${day2.slice(-2)}`;
        callback(result1, result2);
      }
    });
  },
};
