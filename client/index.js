const Nes = require('nes/client')
const client = new Nes.Client('ws://localhost:3000')
const yo = require('yo-yo')

client.connect(function (err) {
  if (err) return console.error(err)

  client.request('bot', function (err, body) {
    if (err) return console.error(err)

    body.subReplies.forEach((msg, i) => {
      setTimeout(() => {
        addToChat({msg: msg.string, classes: 'tl pl3 bg-light-green'})
        if (i === body.subReplies.length - 1) renderButtons(body.buttons)
      }, msg.delay)
    })
  })
})

document.getElementById('form').addEventListener('submit', function (e) {
  e.preventDefault()

  const value = document.forms.form.elements.input.value

  if (!value) return

  const msg = {
    type: 'message',
    id: client.id,
    message: value
  }

  addToChat({msg: msg.message, classes: 'fr pr3 tr bg-light-yellow'})
  document.forms.form.elements.input.value = ''

  sendMsg(msg)
})

function sendMsg (msg) {
  client.message(msg, botReplies)
}

function botReplies (err, body) {
  if (err) return console.error(err)
  console.log(body.topicName, body.debug)
  if (!body.subReplies.length && !body.string) return

  if (!body.subReplies.length) {
    setTimeout(function () {
      addToChat({msg: body.string, classes: 'tl ph3 bg-light-green'})
    }, 600)
  } else {
    body.subReplies.forEach((msg) => {
      setTimeout(() => {
        addToChat({msg: msg.string, classes: 'tl ph3 bg-light-green'})
      }, msg.delay)
    })
  }

  if (body.buttons) {
    renderButtons(body.buttons)
  } else {
    renderInput()
  }
}

function addToChat (tplData) {
  const messages = document.getElementById('messages')
  const node = yo`<div class="db pa2 w-100 cf">
    <blockquote class="ma0 br2 w-80 lh-copy pv2 ${tplData.classes}">${tplData.msg}</blockquote>
  </div>`
  messages.appendChild(node)
  messages.scrollTop = messages.scrollHeight
}

const submitBtn = yo`<button type="submit" class="light-green flex-none">
  <svg width="36px" height="36px" viewBox="0 0 89 78" transform="translate(2.5, 2.5)" xmlns="http://www.w3.org/2000/svg">
      <path d="M.492.414l88.361 38.642L.493 77.103V46.856l63.447-8.098L.492 30.48z" fill="currentColor" fill-rule="evenodd"/>
  </svg>
</button>`

function renderInput () {
  const oldChild = document.getElementById('form').firstElementChild
  const input = yo`<div class="flex justify-end items-center">
    <input id="input" class="ba b--black-10 ml2 pa2 mv2 flex-auto" autocomplete="off" autofocus style="outline:none" />${submitBtn}
  </div>`
  document.getElementById('form').replaceChild(input, oldChild)
  document.getElementById('input').focus()
}

function onChange (e) {
  const msg = {
    type: 'message',
    id: client.id,
    message: e.target.id
  }

  sendMsg(msg)
  addToChat({msg: msg.message, classes: 'fr pr3 tr bg-light-yellow'})
}

function renderButtons (buttons) {
  const oldChild = document.getElementById('form').firstElementChild
  const butts = yo`<div style="width:100%;" class="flex justify-center items-center mb2">${
    buttons.map((button) => {
      return yo`<label for="${button}" class="bg-light-yellow pa2 mh2">${button}<input name="reply" type="radio" class="dn" data-value="${button}" id="${button}" /></label>`
    })
  }</div>`

  document.getElementById('form').replaceChild(butts, oldChild)

  buttons.forEach((button) => {
    document.getElementById(button).addEventListener('change', onChange)
  })
}
