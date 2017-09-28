'use strict';

var superscript = require('superscript').default;
var Hapi = require('hapi');
var Nes = require('nes');
var Inert = require('inert');
var path = require('path');
var config = require('config');

var server = new Hapi.Server();
var bot = void 0;

server.connection({
  host: config.host,
  port: config.port
});

var plugins = [{
  register: Nes,
  options: {
    onMessage: function onMessage(socket, message, botReply) {
      bot.reply(socket.id, message.message, function (err, msg) {
        botReply(err || msg);
      });
    }
  }
}, { register: Inert }];

server.register(plugins, function (err) {
  if (err) throw err;

  server.route({
    method: 'GET',
    path: '/',
    config: {
      handler: function handler(req, reply) {
        return reply.file(path.join(__dirname, '..', 'client', 'index.html'));
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/bot',
    config: {
      id: 'bot',
      handler: function handler(req, reply) {
        return reply({
          buttons: ['ok lets go', 'maybe later'],
          subReplies: [{ delay: 0, string: 'I\'m the TABLEFLIP adventure bot.' }, { delay: 0, string: 'I\'m going to ask you some questions about you and your project is that ok?' }]
        });
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: path.join(__dirname, '..', 'public')
      }
    }
  });

  var options = {
    factSystem: {
      clean: true
    },
    importFile: './data.json',
    logPath: null,
    mongoURI: config.mongo
  };

  superscript.setup(options, function (err, botInstance) {
    if (err) {
      console.error(err);
    }
    bot = botInstance;

    server.start(function (err) {
      if (err) throw err;
      console.log('bot server running on port', server.info.port);
    });
  });
});