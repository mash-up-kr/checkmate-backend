const conn = require('./mysql');
const config = require('./config');

module.exports = {
  workIdGenerator (res, userId, callback) {
   let id = `WO${userId}A`;
   const sql = "SELECT COUNT(*) AS 'count' FROM works WHERE user_id=?";
   conn.query(sql, [userId], function(err, results) {
    if(err) {
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
    const sql = 'SELECT pay_day FROM works WHERE id=?'
    conn.query(sql, [workId], function(err, results) {
      if(err | results.length === 0) {
        console.log(err);
        res.status(500).json(config.status.sc500);
      } else {
        const today = new Date();
        const beforePayDay = (today.getMonth() > 0) ? new Date(today.getFullYear(), today.getMonth(), results[0].pay_day + 1) : new Date(today.getFullYear() - 1, 12, results[0].pay_day + 1);
        let diffDate_1 = beforePayDay instanceof Date ? beforePayDay : new Date(beforePayDay);
        let diffDate_2 = today instanceof Date ? today : new Date(today);
        diffDate_1 = new Date(diffDate_1.getFullYear(), diffDate_1.getMonth()+1, diffDate_1.getDate());
        diffDate_2 = new Date(diffDate_2.getFullYear(), diffDate_2.getMonth()+1, diffDate_2.getDate());
        let totalDay = Math.abs(diffDate_2.getTime() - diffDate_1.getTime());
        totalDay = Math.ceil(totalDay / (1000 * 3600 * 24));
        callback(totalDay);
      }
    });
  }
};