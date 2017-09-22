'use strict';

var _superscript = require('superscript');

var _superscript2 = _interopRequireDefault(_superscript);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = (0, _express2.default)();
var PORT = _config2.default.PORT,
    MONGODB_URI = _config2.default.MONGODB_URI;


server.use(_bodyParser2.default.json());

var bot = void 0;

server.get('/superscript', function (req, res) {
  if (req.query.message) {
    return bot.reply('user1', req.query.message, function (err, reply) {
      if (err) return console.error(err);
      console.log({ reply: reply });
      res.json({
        message: reply.string
      });
    });
  }
  return res.json({ error: 'No message provided.' });
});

var options = {
  factSystem: {
    clean: true
  },
  importFile: './data.json',
  logPath: null,
  mongoURI: MONGODB_URI
};

_superscript2.default.setup(options, function (err, botInstance) {
  if (err) {
    console.error(err);
  }
  bot = botInstance;

  server.listen(PORT, function () {
    console.log('===> \uD83D\uDE80  Server is now running on port ' + PORT);
  });
});