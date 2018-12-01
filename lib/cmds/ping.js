const embed = require('./../modules/embed')

exports.run = (msg, args, bot, Discord, DB) => {
  embed.init(bot);
  var start = new Date()
  msg.channel.send(embed.embed(['퐁!'], ['측정 중...'])).then(e => {
    var end = new Date() - start
    e.edit(embed.embed(['퐁!'], [end + 'ms']))
  })
}

exports.info = {
  cmd: 'ping',
  description: '퐁!',
  example: 'ping',
  type: '기본'
}
