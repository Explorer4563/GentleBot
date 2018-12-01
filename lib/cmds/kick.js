const embed = require('./../modules/embed')
const chkown = require('./../modules/chkown')
const chkadm = require('./../modules/chkadm')

exports.run = (msg, args, bot, Discord, DB) => {
  if (!chkown.run(msg.author.id) && !chkadm.run(msg, 'KICK_MEMBERS')) return msg.channel.send(embed.embed(['오류'], ['관리자 권한이 필요합니다.'])).then(e => { e.delete(3000) })
  let user = msg.mentions.members.first()
  if (!user) return msg.channel.send(embed.embed(['오류'], ['Mention 으로 대상을 지정해주세요!'])).then(e => { e.delete(3000) })
  embed.init(bot)
  msg.guild.member(user).kick()
  .then(() => { msg.channel.send(embed.embed(['추방'], ['<@' + user.id + '> 님을 성공적으로 추방시켰습니다!'])) })
  .catch(e => { msg.channel.send(embed.embed(['오류'], [e.toString()])) })
}

exports.info = {
  cmd: 'kick',
  description: '해당 유저를 추방시킵니다',
  example: 'kick [mention]',
  type: '관리자'
}
