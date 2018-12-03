const embed = require('./../modules/embed')

exports.run = (msg, args, bot, Discord, DB) => {
  embed.init(bot)
  let server = DB.find('servers', ['id'], [msg.guild.id])[0]
  server.opts = JSON.parse(server.opts)
  if (!server.opts.eula || !server.opts.eula.logging) return msg.channel.send(embed.embed(['에러'], ['EULA를 동의하셔야 로깅, restore 기능을 이용하실 수 있습니다\n!!eula 로 EULA를 체크해주세요.']))

  if (!Number(args[2]) || Number(args[3]) < 1) return msg.channel.send(embed.embed(['에러'], ['uint로 변환할 수 없습니다']))
  let titles = []
  let values = []

  if (args[1] !== 'del' && args[1] !== 'edit' && args[1] !== 'all') return msg.channel.send(embed.embed(['에러'], ['잘못된 구분입니다']))
  let res = DB.find('chats', ['sid', 'cid', 'type'], [msg.guild.id, msg.channel.id, args[1] === 'all' ? '!cmd' : args[1]], null, 'ORDER BY id DESC LIMIT ' + Number(args[2]))
  for (i = 0; i < 25; i++) {
    if (res[i]) {
      let temp = '<@' + res[i].aid + '> | ' + res[i].date + '\n'
      if (res[i].before) temp += '**Before :**' + res[i].before + '\n**After :**'
      temp += res[i].content
      titles.push(res[i].type === 'del' ? 'Deleted Message' : 'Edited Message')
      values.push(temp)
    }
  }
  msg.channel.send(embed.embed(titles, values))
}

exports.info = {
  cmd: 'restore',
  description: '삭제된 메시지 복구',
  example: 'restore [all|edit|del] [복구할 메시지 수량]',
  type: '기타'
}
