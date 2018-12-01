const embed = require('./../modules/embed')
const chkown = require('./../modules/chkown')
const merge = require('./../modules/merge_args')

exports.run = (msg, args, bot, Discord, DB) => {
  if(!chkown.run(msg.author.id)) return msg.channel.send(embed.embed(['오류'], ['당신은 봇 소유주가 아닙니다']))
  embed.init(bot)
  let reason = merge.run(args, 3) || '내용이 없습니다.'
  let user = DB.find('users', ['id'], [msg.mentions.members.first().id])[0]
  if (user) {
    user.opts = JSON.parse(user.opts)
    switch (args[1]) {
      case 'black':
        user.opts.isblack = true
        user.opts.blackreason = reason
        msg.channel.send(embed.embed(['블랙리스트'], ['<@' + msg.mentions.members.first().id + '>' + '님이 블랙리스트에 추가되었습니다\n사유 : ' + reason]))
        break
      case 'unblack':
        user.opts.isblack = false
        user.opts.blackreason = ''
        msg.channel.send(embed.embed(['블랙리스트'], ['<@' + msg.mentions.members.first().id + '>' + '님이 블랙리스트에 제거되었습니다']))
        break
      default:
        break
    }
    DB.update('users', ['id'], [msg.mentions.members.first().id], ['opts'], [JSON.stringify(user.opts)])
  } else msg.channel.send(embed.embed(['오류'], ['맨션을 찾을 수 없습니다']))
}

exports.info = {
  cmd: 'black',
  description: '해당 유저를 블랙리스트에 추가합니다.',
  example: 'black [black|unblack] [mention] [reason]',
  type: '관리자'
}
