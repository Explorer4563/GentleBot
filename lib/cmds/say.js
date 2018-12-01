const merge = require('./../modules/merge_args')

exports.run = (msg, args, bot, Discord, DB) => {
  msg.channel.send(merge.run(args))
}

exports.info = {
  cmd: 'say',
  description: '봇이 따라 말해드립니다!',
  example: 'say [내용]',
  type: '기본'
}
