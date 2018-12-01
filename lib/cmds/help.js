const OPTION = require('./../../bot.json')
const embed = require('./../modules/embed')
const fs = require('fs')
const path = require('path')

let cmds = {}
fs.readdir(path.join(__dirname), (err, files) => {
  if (!err) {
      files.forEach(item => {
          if (item.endsWith('.js')) {
            let temp = require(path.join(__dirname, item)).info
            if (!cmds[temp.type]) cmds[temp.type] = []
            cmds[temp.type].push(temp)
          }
      })
  } else console.log(err.toString())
})

exports.run = (msg, args, bot, Discord, DB) => {
  embed.init(bot)
  let result = embed.embed()
  args[2] = Number(args[2]) < 1 || Number(args[2]).toString() === 'NaN' ? 1 : Number(args[2])
  if (args[1] && cmds[args[1]]) for (let i = (args[2] - 1) * 5; i < args[2] * 5; i++) {
    let temp = cmds[args[1]][i]
    if (temp) result.embed.fields.push({ name: OPTION.cprefix + temp.cmd, value: temp.description + '\n사용 예시:' + OPTION.cprefix + temp.example })
  }
  if(!args[1] || !cmds[args[1]]) result = embed.embed(['기본', '기타', '게임', '관리자'], ['기본적인 명령어', '이외의 명령어', '다양한 게임(?)', '관리자만 사용 가능'])
  msg.channel.send(result)
}

exports.info = {
  cmd: 'help',
  description: '도움말',
  example: 'help [category] [page(1 ~ n)|null]',
  type: '기본'
}
