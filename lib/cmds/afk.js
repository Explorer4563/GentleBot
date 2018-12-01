const embed = require('./../modules/embed')
const merge = require('./../modules/merge_args')

exports.run = (msg, args, bot, Discord, DB) => {
  embed.init(bot)
  let afkreason = merge.run(args, 1) || '내용이 없습니다.'
  let user = DB.find('users', ['id'], [msg.author.id])[0]
  if (user) {
    user.opts = JSON.parse(user.opts)
    user.opts.isafk = true
    user.opts.afkreason = afkreason
    DB.update('users', ['sid', 'id'], [msg.guild.id, msg.author.id], ['opts'], [JSON.stringify(user.opts)])
    msg.channel.send(embed.embed([msg.author.username + '님이 잠수를 시작했습니다'], ['사유 : ' + afkreason]))
  }
}

exports.info = {
  cmd: 'afk',
  description: '잠수',
  example: 'afk [reason|null]',
  type: '기본'
}
