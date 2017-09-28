const superscript = require('superscript').default
const Hapi = require('hapi')
const Nes = require('nes')
const Inert = require('inert')
const path = require('path')
const config = require('config')

const server = new Hapi.Server()
let bot

server.connection({
  host: config.host,
  port: config.port
})

const plugins = [
  {
    register: Nes,
    options: {
      onMessage: (socket, message, botReply) => {
        bot.reply(socket.id, message.message, (err, msg) => {
          botReply(err || msg)
        })
      }
    }
  },
  { register: Inert }
]

server.register(plugins, (err) => {
  if (err) throw err

  server.route({
    method: 'GET',
    path: '/',
    config: {
      handler: (req, reply) => reply.file(path.join(__dirname, '..', 'client', 'index.html'))
    }
  })

  server.route({
    method: 'GET',
    path: '/bot',
    config: {
      id: 'bot',
      handler: (req, reply) => reply({
        buttons: ['ok lets go', 'maybe later'],
        subReplies: [
          {delay: 0, string: 'I\'m the TABLEFLIP adventure bot.'},
          {delay: 0, string: 'I\'m going to ask you some questions about you and your project is that ok?'}
        ]
      })
    }
  })

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: path.join(__dirname, '..', 'public')
      }
    }
  })

  const options = {
    factSystem: {
      clean: true
    },
    importFile: './data.json',
    logPath: null,
    mongoURI: config.mongo
  }

  superscript.setup(options, (err, botInstance) => {
    if (err) {
      console.error(err)
    }
    bot = botInstance

    server.start((err) => {
      if (err) throw err
      console.log('bot server running on port', server.info.port)
    })
  })
})
