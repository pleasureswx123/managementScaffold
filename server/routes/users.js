var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.set('Content-Type', 'application/json');
  const data = {
    'code': 0,
    'msg': 'success',
    'data': {
      test: '测试'
    }
  };
  res.status(200).send(data);
});

module.exports = router;
