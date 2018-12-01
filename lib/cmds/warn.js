const embed = require('./../modules/embed')
const chkown = require('./../modules/chkown')
const chkadm = require('./../modules/chkadm')
const merge = require('./../modules/merge_args')

exports.run = (msg, args, bot, Discord, DB) => {
  embed.init(bot)
  let target = args[2] ? msg.mentions.members.first() : (args[1] === 'up' || args[1] === 'down') ? undefined : msg.author
  if (args[1] === 'up' || args[1] === 'down') if (!chkown.run(msg.author.id) && !chkadm.run(msg, 8)) return msg.channel.send(embed.embed(['오류'], ['관리자 권한이 필요합니다.'])).then(e => { e.delete(3000) })
  if (!target) return msg.channel.send(embed.embed(['오류'], ['Mention 으로 대상을 지정해주세요!'])).then(e => { e.delete(3000) })
  let user = DB.find('users', ['sid', 'id'], [msg.guild.id, target.id])[0]
  if (!user) return msg.channel.send(embed.embed(['오류'], ['Mention 을 찾을 수 없습니다']))
  user.opts = JSON.parse(user.opts)
  let reason = merge.run(args, 3) || '사유가 없습니다.'
  let gap = 0

  switch (args[1]) {
    case 'up':
      gap++
      break
    case 'down':
      gap--
      break
    case 'view':
      msg.channel.send(embed.embed(['경고'], [target + ' 님의 경고 : ' + user.opts.warn]))
      break
    default:
      break
  }

  if (gap !== 0) {
    if (!user.opts.warn && gap < 0) return msg.channel.send(embed.embed(['오류'], ['음수가 될 수 없습니다.'])).then(e => { e.delete(3000) })
    if (gap < 0) msg.channel.send(embed.embed(['경고'], [target + ' 님의 경고를 1회 차감시켰습니다\n**사유 : **' + reason]))
    else if (gap > 0) msg.channel.send(embed.embed(['경고'], [target + ' 님의 경고를 1회 증가시켰습니다\n**사유 : **' + reason]))
    user.opts.warn += gap
    DB.update('users', ['sid', 'id'], [msg.guild.id, msg.mentions.members.first().id], ['opts'], [JSON.stringify(user.opts)])
    if (user.opts.warn >= 5) {
      msg.guild.member(target).kick()
      user.opts.warn = 0
    }
  }
}

exports.info = {
  cmd: 'warn',
  description: '해당 유저에게 경고를!',
  example: 'warn [up|down] [mention|null] [reason|null]',
  type: '관리자'
}