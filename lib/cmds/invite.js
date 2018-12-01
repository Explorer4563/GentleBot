const url = require('./../../bot.json').invite_url
const embed = require('./../modules/embed')

exports.run = (msg, args, bot, Discord, DB) => {
  embed.init(bot)
  msg.channel.send(embed.embed(['봇 초대 링크'], [url]))
}

exports.info = {
  cmd: 'invite',
  description: '봇 초대 링크',
  example: 'invite',
  type: '기본'
}
