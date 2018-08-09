const conn = require('./mysql');
const config = require('./config');

module.exports = {
  workIdGenerator (req, userId, callback) {
   let id = `WO${userId}A`;
   const sql = "SELECT COUNT(*) AS 'count' FROM works WHERE user_id=?";
   conn.query(sql, [userId], function(err, results) {
    if(err) {
      console.log(err);
      req.status(500).json(config.status.sc500);
    } else {
      id += `${results[0].count}`;
      callback(id);
    }
   });
  },
  baseDayCalculator(callback) {
    const before_date = new Date();
    const after_date = (before_date.getMonth() > 0) ? new Date(before_date.getFullYear(), before_date.getMonth(), 0) : new Date(before_date.getFullYear() - 1, 12, 0);
    const base_day = after_date.getDate();
    callback(base_day);
  }
};