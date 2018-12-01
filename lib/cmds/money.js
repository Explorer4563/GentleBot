const embed = require('./../modules/embed')
const chkadm = require('./../modules/chkadm')
const chkown = require('./../modules/chkown')

exports.run = (msg, args, bot, Discord, DB) => {
  embed.init(bot)
  let res
  let _embed = embed.embed()
  switch (args[1]) {
    case 'rank':
      DB.find('users', ['sid'], [msg.guild.id], (res) => {
        for (let i = 0; i < res.length; i++) {
          bot.fetchUser(res[i].id)
          .then(u => {
            _embed = embed.addfield({ name: (i + 1) + '위', value: u + ' | ' + res[i].money})
            if (i === res.length - 1) msg.channel.send(_embed)
          })
          .catch(e => { })
        }
      }, 'ORDER BY money DESC limit 10')
      break
    case 'set':
      if (!chkown.run(msg.author.id) && !chkadm.run(msg, 8)) return msg.channel.send(embed.embed(['오류'], ['관리자 권한이 필요합니다.'])).then(e => { e.delete(3000) })
      if (!msg.mentions.users.first()) return msg.channel.send(embed.embed(['오류'], ['Mention 으로 대상을 지정해주세요!'])).then(e => { e.delete(3000) })
      let target = msg.mentions.users.first()
      var user = DB.find('users', ['sid', 'id'], [msg.guild.id, target.id])
      user.money = Number(args[3])
      DB.update('users', ['sid', 'id'], [msg.guild.id, target.id], ['money'], [user.money])
      _embed = embed.embed(['돈'], ['성공적으로 ' + target + '의 돈을 ' + args[3] + '으로 지정하였습니다'])
      break
    default:
      var user = msg.mentions.users.first() || msg.author
      res = DB.find('users', ['sid', 'id'], [msg.guild.id, user.id])[0]
      if (res) _embed = embed.embed(['돈'], [user + ' 님의 돈 | ' + res.money + '원'])
      else return msg.channel.send(embed.embed(['오류'], ['존재하지 않는 유저입니다.'])).then(e => { e.delete(3000) })
  }
  if (args[1] !== 'rank') msg.channel.send(_embed)
 }

exports.info = {
  cmd: 'money',
  description: '돈과 관련된 명령어를 다룹니다.',
  example: 'money [type] [mention|none] [arg|none]',
  type: '게임'
}
