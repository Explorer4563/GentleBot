const embed = require('./../modules/embed')
const chkadm = require('./../modules/chkadm')
const chkown = require('./../modules/chkown')

exports.run = (msg, args, bot, Discord, DB) => {
  if (!args[1]) return
  if (!chkadm.run(msg, 'MANAGE_MESSAGES') && !chkown.run(msg.author.id)) return msg.channel.send(embed.embed(['에러'], ['관리자 권한이 없습니다.'])).then(e => { e.delete(3000) })
  if (!msg.mentions.members.first()) return msg.channel.send(embed.embed(['에러'], ['멘션을 찾을 수 없습니다.'])).then(e => { e.delete(3000) })
  embed.init(bot)
  let role = _role = args[1] === 'all' ? findrole('@everyone') : findrole('MUTE')
  //if (!role.hasPermission('SEND_MESSAGES')) return
  if (args[1] == 'all') {
    _role.permissions += -0x800
    role.edit(_role)
  } else {
    if (!role) msg.guild.createRole({ name: 'MUTE', color: 'EEEEEE', mentionable: false, permissions: 0 })
    role = findrole('MUTE')
    msg.mentions.members.first().addRole(role)
  }

  msg.channel.send(embed.embed(['뮤트'], [msg.mentions.members.first() + '님을 뮤트시켰습니다'])).then(e => { e.delete(3000) })

  msg.guild.channels.forEach(chan => {
    try { chan.overwritePermissions(role, { 'SEND_MESSAGES': false }) }
    catch (e) {}
  })

  function findrole (r) {
    return msg.guild.roles.find(role => role.name === r)
  }
}

exports.info = {
  cmd: 'mute',
  description: '뮤트',
  example: 'mute [mention|all] [reason|null]',
  type: '관리자'
}
