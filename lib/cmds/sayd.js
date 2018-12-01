const say = require('./say')

exports.run = (msg, args, bot, Discord, DB) => {
  msg.delete(0)
  say.run(msg, args, bot, Discord, DB)
}

exports.info = {
  cmd: 'sayd',
  description: '봇이 대신 말해드립니다!',
  example: 'sayd [내용]',
  type: '기타'
}
