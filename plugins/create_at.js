var moment = require('moment');
var objectIdToTimestamp = require('objectid-to-timestamp');

module.exports = function(schema) {
  var afterFind = function(results) {
    results.forEach(function (item) {
          item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
        });
        return results;
  };

  var afterFindOne = function(result) {
    if (result) {
      result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
    }
    return result;
  };

  schema.post('find', afterFind);
  schema.post('findOne', afterFindOne);
}
