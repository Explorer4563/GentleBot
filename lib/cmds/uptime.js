const embed = require('../modules/embed')

exports.run = (msg, args, bot, Discord, DB) => {
  embed.init(bot)
  msg.channel.send(embed.embed(['가동시간'], [parse(process.uptime())]))

  function parse (a) {
    a = Number(a.toString().split('.')[0])
    day = Math.floor(a / 86400)
    a -= day * 86400
    hour = Math.floor(a / 3600)
    a -= hour * 3600
    minute = Math.floor(a / 60)
    a -= minute * 60
    second = a

    return day + "일 " + hour + "시간 " + minute + "분 " + second + "초"
  }
}

exports.info = {
  cmd: 'uptime',
  description: '봇의 가동시간을 확인합니다',
  example: 'uptime',
  type: '기본'
}
