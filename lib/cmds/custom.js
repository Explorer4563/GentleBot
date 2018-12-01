const fs = require('fs')
const embed = require('./../modules/embed')
const merge = require('./../modules/merge_args')
const chkadm = require('./../modules/chkadm')

const cprefix = require('./../../bot.json').cprefix

exports.run = (msg, args, bot, Discord, DB) => {
  embed.init(bot)
  let id = msg.guild.id
  let server = DB.find('servers', ['id'], [id])[0]
  if (server) server.opts = JSON.parse(server.opts)
  let customs = server ? server.opts.adv : []

  if (args[1] === 'add') {
    if (args[3]) {
      args[3] = merge.run(args, 3, args.length, true)
    } else return msg.channel.send(embed.embed(['에러'], ['출력하실 내용을 입력해주세요.']))
  } else if (args[1] === 'del') {
    if (!args[2]) return msg.channel.send(embed.embed(['에러'], ['인수가 1개 더 필요합니다.']))
  }

  switch (args[1]) {
    case 'add':
      customs.push({ 'cmd': args[2], 'result': args[3] })
      msg.channel.send(embed.embed(['시뮬레이션'], ['입력 : ' + cprefix + args[2] + '\n' + '출력 : ' + args[3]]))
      save()
      break
    case 'del':
      if (customs && customs[0]) {
        for (i = 0; i < customs.length; i++) {
          if (customs[i].cmd == args[2]) {
            customs.splice(i, 1)
            save()
            break
          }
        }
      }
      break
    case 'list':
      let title = []
      let value = []
      if (customs && customs[0]) {
        for (i = 0; i < customs.length; i++) {
          title.push(cprefix + customs[i].cmd || '? 이게 왜 없지?')
          value.push(customs[i].result || '내용이 없습니다.')
        }
        msg.channel.send(embed.embed(title, value))
      } else msg.channel.send(embed.embed(['커스텀 명령어가 없습니다'], ['custom add 명령어로 만들어 나가세요!']))
      break
    case 'help':
      msg.channel.send(embed.embed(['커스텀 명령어 도움말!'], ['내용 1']))
      break
    default:
      break
  }

  function save(){
    server.opts.adv = customs
    DB.update('servers', ['id'], [id], ['opts'], [JSON.stringify(server.opts)])
  }
}

exports.info = {
  cmd: 'custom',
  description: '커스텀 명령어',
  example: 'custom [add|del|list] [prefix|null] [content|null]',
  type: '기타'
}
