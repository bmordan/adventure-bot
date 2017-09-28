const async = require('async')
const request = require('request')

exports.sendEnquiry = function (cb) {
  const db = this.user.memory.db
  const userId = this.user.id
  const queries = [
    'name',
    'email',
    'title',
    'brief',
    'budget',
    'designs',
    'open'
  ].reduce((memo, field) => {
    memo[field] = (done) => db.get({
      subject: field,
      predicate: userId
    }, (e, r) => done(e, r[0].object))
    return memo
  }, {})

  async.parallel(queries, (err, results) => {
    if (err) return cb(err)

    const {
      name,
      email,
      title,
      brief,
      budget,
      designs,
      open
    } = results

    request.post({
      url: 'https://post.tableflip.io/tableflip.io',
      body: {
        'name': name,
        'email': email,
        'project-name': title,
        'aim': brief,
        'budget': budget,
        'designs': designs,
        'open-source': open
      },
      json: true
    }, (err) => {
      cb(err, { text: 'I have just sent your project details to the team.' })
    })
  })
}
