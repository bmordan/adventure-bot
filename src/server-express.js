import superscript from 'superscript'
import express from 'express'
import bodyParser from 'body-parser'
import config from 'config'

const server = express()
const { PORT, MONGODB_URI } = config

server.use(bodyParser.json())

let bot

server.get('/superscript', (req, res) => {
  if (req.query.message) {
    return bot.reply('user1', req.query.message, (err, reply) => {
      if (err) return console.error(err)
      console.log({reply})
      res.json({
        message: reply.string
      })
    })
  }
  return res.json({ error: 'No message provided.' })
})

const options = {
  factSystem: {
    clean: true
  },
  importFile: './data.json',
  logPath: null,
  mongoURI: MONGODB_URI
}

superscript.setup(options, (err, botInstance) => {
  if (err) {
    console.error(err)
  }
  bot = botInstance

  server.listen(PORT, () => {
    console.log(`===> 🚀  Server is now running on port ${PORT}`)
  })
})
