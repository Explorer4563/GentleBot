const embed = require('./../modules/embed')
const chkown = require('./../modules/chkown')
const chkadm = require('./../modules/chkadm')
const merge = require('./../modules/merge_args')

exports.run = (msg, args, bot, Discord, DB) => {
  if (!chkown.run(msg.author.id) && !chkadm.run(msg, 'BAN_MEMBERS')) return msg.channel.send(embed.embed(['오류'], ['관리자 권한이 필요합니다.'])).then(e => { e.delete(3000) })
  let user = msg.mentions.members.first() ? msg.mentions.members.first().id : args[2]
  user = bot.fetchUser(user).catch(() => { return undefined })
  let reason = merge.run(args, 3) || '사유가 없습니다.'
  if (!user) return msg.channel.send(embed.embed(['오류'], ['Mention 또는 ID로 대상을 지정해주세요!'])).then(e => { e.delete(3000) })
  embed.init(bot)
  if (user.then) user.then(u => { func(u) })
  else func(user)
  
  function func(u) {
    switch (args[1]) {
      case 'add':
        msg.guild.ban(u, { reason: reason })
        msg.guild.member(u).ban()
        .then(() => { msg.channel.send(embed.embed(['차단'], [u + ' 님을 성공적으로 차단시켰습니다!\n사유 : ' + reason])) })
        .catch(e => { msg.channel.send(embed.embed(['오류'], [e.toString()])) })
        break
      case 'del':
        msg.guild.unban(u, reason)
        .then(() => { msg.channel.send(embed.embed(['차단'], [u + ' 님을 성공적으로 차단 해제시켰습니다!\n사유 : ' + reason])) })
        .catch(e => { msg.channel.send(embed.embed(['오류'], [e.toString()])) })
        break
      default:
        break
    }
  }
}

exports.info = {
  cmd: 'ban',
  description: '해당 유저를 차단시킵니다',
  example: 'ban [add|del] [mention|id]',
  type: '관리자'
}
