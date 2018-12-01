//어쩌피 플레이스홀더(?)가 추가되거나 수정되지 않는 이상
//알 필요가 없는 소스다.
const merge = require('./merge_args')

exports.run = (msg, args, channel, DB) => {
  let customs = DB.find('servers', ['id'], [channel.guild.id])[0] || []
  let tmp = merge.run(args)
  if (customs) {
    customs = JSON.parse(customs.opts).adv
    for (i = 0; i < customs.length; i++) {
      if (args[0] == customs[i].cmd) {
        let result = customs[i].result.replace('{percent}', Math.floor(Math.random() * 100) + 1 + '%').replace('{args}', tmp).replace('{me}', '<@' + msg.author.id + '>')
        if(result.indexOf('{mention}') >= 0 && msg.mentions.members.first()) result = result.replace('{mention}', msg.mentions.members.first())
        channel.send(result)
        return true
      }
    }
  }
  return false
}
