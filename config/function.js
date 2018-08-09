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
  }
};