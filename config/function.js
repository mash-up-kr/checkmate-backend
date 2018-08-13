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
        let difDate2 = today instanceof Date ? today : new Date(today);
        diffDate1 = new Date(diffDate1.getFullYear(), diffDate1.getMonth() + 1, diffDate1.getDate());
        difDate2 = new Date(difDate2.getFullYear(), difDate2.getMonth() + 1, difDate2.getDate());
        let totalDay = Math.abs(difDate2.getTime() - diffDate1.getTime());
        totalDay = Math.ceil(totalDay / (1000 * 3600 * 24));
        callback(totalDay);
      }
    });
  },
};
