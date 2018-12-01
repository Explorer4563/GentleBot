const embed = require('./../modules/embed')
const chkown = require('./../modules/chkown')

exports.run = (msg, args, bot, Discord, DB) => {
  if(!chkown.run(msg.author.id)) return msg.channel.send(embed.embed(['오류'], ['당신은 봇 소유주가 아닙니다']))
  embed.init(bot)
	msg.channel.send(embed.embed(['shutdown'], ['BYE!'])).then(e => {
		process.exit(0)
	})
  }

exports.info = {
  cmd: 'shutdown',
  description: '봇을 종료 합니다.',
  example: 'shutdown',
  type: '관리자'
}
