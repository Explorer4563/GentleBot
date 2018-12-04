const embed = require('./../modules/embed')
const chkown = require('./../modules/chkown')
const chkadm = require('./../modules/chkadm')
const merge = require('./../modules/merge_args')

exports.run = (msg, args, bot, Discord, DB) => {
  if (!chkown.run(msg.author.id) && !chkadm.run(msg, 8)) return
  let server = DB.find('servers', ['id'], [msg.guild.id])[0]
  server.opts = JSON.parse(server.opts)
  let before = server.opts.welcome
  //console.log(args);
  
  switch (args[1]) {
    case 'true':
      server.opts.welcome = true
      break
    case 'false':
      server.opts.welcome = false
      break
    default:
      return
  }

  if (args[2]) {
    if (args[2].startsWith('<#')) args[2] = args[2].replace('<#', '').replace('>', '').replace('!', '')
    if (msg.guild.channels.find(chan => chan.id === args[2])) server.opts.wchannel = args[2]
  }
  if (args[3]) server.opts.wmessage = merge.run(args, 3)
  DB.update('servers', ['id'], [msg.guild.id], ['opts'], [JSON.stringify(server.opts)])
  msg.channel.send(embed.embed(['웰컴 메시지 여부'], [`${before} => ${server.opts.welcome}\n<#${server.opts.wchannel}>\n${server.opts.wmessage}`]))
}

exports.info = {
  cmd: 'welcome',
  description: '사용자가 서버에 처음들어왔을때 안내메세지를 표시합니다',
  example: 'welcome [true|false] [channelId] [message]',
  type: '관리자'
}
