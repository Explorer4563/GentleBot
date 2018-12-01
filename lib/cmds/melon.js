const embed = require('./../modules/embed')
const melon = require('melon-chart-api')

exports.run = (msg, args, bot, Discord, DB) => {
  if (Number(args[1]) < 11 && Number(args[1]) > 0) {
    embed.init(bot)
    let now = new Date()
    now = (now.getMonth + 1) + '/' + now.getDate() + '/' + now.getFullYear
    let res
    melon(now, { cutLine: Number(args[1]) }).daily().then(res => {
      res.data.forEach(item => {
        res = embed.addfield({ name: item.rank + '위', value: item.title + ' - ' + item.artist })
      })
      msg.channel.send(res)
    })
  } else msg.channel.send(embed.embed(['오류'], ['범위는 1 ~ 10 이어야 합니다.']))
}

exports.info = {
  cmd: 'melon',
  description: '탑 n 목록을 불러옵니다!',
  example: 'melon [1 ~ 10]',
  type: '기타'
}
