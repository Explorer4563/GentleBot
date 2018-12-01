//MAIN-MODULES
const OPTION = require('./bot.json')
const Discord = require('discord.js')
const bot = new Discord.Client()
const DB = require('./lib/modules/db')

//SUB-MODULES
const embed = require(OPTION.mds_url + 'embed')
const chkcustom = require(OPTION.mds_url + 'custom')
const fs = require('fs')
const path = require('path')
const chkown = require(OPTION.mds_url + 'chkown')
//GET-COMMANDS
let cmds = load()
let cmdc = {}

//SETTINGS
let cprefix = OPTION.cprefix
let bprefix = OPTION.bprefix
let game = OPTION.game.replace('{bprefix}', bprefix)

//BOT-ON-READY
bot.on('ready', () => {
  console.log('=============================')
  console.log(bot.user.tag)
  console.log('=============================')
  bot.user.setActivity(game)
})

//BOT-ON-MESSAGE
bot.on('message', (msg) => {
  if (msg.author.bot || !msg.guild) return
  embed.init(bot)

  let _log
  let server = guild(msg)
  let args = msg.content.slice(cprefix.length).split(' ')

  //EULA
  if (OPTION.eula.using) {
    if (msg.content.startsWith(cprefix) && args[0] === 'eula') {
      if (msg.guild.ownerID !== msg.author.id && !chkown.run(msg.author.id)) return msg.channel.send(embed.embed(['오류'], ['서버 오너만 사용 가능합니다']))
      switch (args[1]) {
        case 'true':
          server.opts.eula = { logging: true }
          msg.channel.send(embed.embed(['EULA'], ['EULA에 동의하셨습니다\n봇의 모든 기능을 이용하실 수 있습니다.']))
          break
        case 'false':
          server.opts.eula = undefined
          msg.channel.send(embed.embed(['EULA'], ['EULA에 동의하지 않으셨습니다\n봇의 일부 기능을 이용하실 수 없습니다.']))
          break
        default:
          msg.channel.send(embed.embed(['EULA', 'EULA-LOGGING', 'USING', 'SO?'], ['봇 EULA입니다\n**-** 2018년 11월 24일 생성', '봇은 삭제하는 메시지를 로깅합니다\n원래는 흑역사 생성 용도였으나\n가끔은 분쟁 해결 용도로 쓰이기도 합니다', '!!eula [true|false]', '어쨋든 __EULA에 동의하지 않는다면 봇의 일부 기능(restore)을 이용하실 수 없음__을 알려드립니다.']))
      }
      DB.update('servers', ['id'], [msg.guild.id], ['opts'], [JSON.stringify(server.opts)])
    }
    if (!server.opts.eula && OPTION.eula.strong) return
  }

  //MUTE
  const findrole = (r) => { if (msg.guild.roles) return msg.guild.roles.find(role => role.name === r) }
  let role = findrole("MUTE")
  if (role && msg.member ? msg.member.roles.has(role.id) : false) { msg.delete(0); return }

  //ETC
  let user = func(msg)
  if (user) {
    //MONEY
    user.money += 1
    DB.update('users', ['sid', 'id'], [msg.guild.id, msg.author.id], ['money'], [user.money])
    //CMD
    if (msg.content.startsWith(cprefix) && !msg.author.bot) {
      //CMD-BLACKLIST
      if (user.opts.isblack === true) return msg.channel.send(embed.embed(['블랙리스트 경고'], ['블랙리스트에 등록되어 명령어가 무시되었습니다.\n사유 :' + user.opts.blackreason])).then(e => { e.delete(3000) })
      if (args[0] === 'reload') {
        if (chkown.run(msg.author.id)) {
          cmds = load()
          cmdc = {}
          return msg.channel.send(embed.embed(['명령어 리로드'], ['명령어 리로드에 성공하였습니다!']))
        } else return
      }
      if (!cmdc[msg.guild.id]) cmdc[msg.guild.id] = cmds
      for (let k = 0; k < cmds.length; k++) {
        if (cmds[k].info.cmd === args[0]) {
          if (server.opts.eula && server.opts.eula.logging) DB.insert('chats', ['sid', 'cid', 'aid', 'content', 'date', 'type'], [msg.guild.id, msg.channel.id, msg.author.id, msg.content, new Date(), 'cmd'])
          return cmdc[msg.guild.id][k].run(msg, args, bot, Discord, DB)
        }
      }
      //CMD-CUSTOM
      if (chkcustom.run(msg, args, msg.channel, DB)) {
        if (OPTION.eula.using && OPTION.usings.logging && server.opts.eula && server.opts.eula.logging) DB.insert('chats', ['sid', 'cid', 'aid', 'content', 'date', 'type'], [msg.guild.id, msg.channel.id, msg.author.id, msg.content, new Date(), 'custom'])
      }
    }
  }
})

bot.on('messageUpdate', (before, after) => {
  if (!before || !after || !after.guild || after.author.bot) return
  let server = guild(before)  
  if (OPTION.eula.using && OPTION.usings.logging && server.opts.eula && server.opts.eula.logging) DB.insert('chats', ['sid', 'cid', 'aid', 'content', 'before', 'date', 'type'], [after.guild.id, after.channel.id, after.author.id, after.content, before.content, new Date(), 'edit'])
})

bot.on('messageDelete', (msg) => {
  if (!msg || !msg.guild || msg.author.bot) return
  let server = guild(msg)
  if (OPTION.eula.using && OPTION.usings.logging && server.opts.eula && server.opts.eula.logging) DB.insert('chats', ['sid', 'cid', 'aid', 'content', 'date', 'type'], [msg.guild.id, msg.channel.id, msg.author.id, msg.content, new Date(), 'del'])
})

//GET-USER-DATA
function func (msg) {
  if (msg.author.bot) return
  let user = DB.find('users', ['sid', 'id'], [msg.guild.id, msg.author.id])[0]
  if (!user) {
    DB.insert('users', ['sid', 'id', 'opts', 'money'], [msg.guild.id, msg.author.id, JSON.stringify({ isafk: false, afkreason: '', warn: 0, rules: { } }), 0])
    user = DB.find('users', ['id'], [msg.author.id])[0]
    user.opts = JSON.parse(user.opts)
  } else user.opts = JSON.parse(user.opts)
  if (user.opts.isafk) {
    msg.channel.send(embed.embed([msg.author.username + ' 님이 깨어나셨습니다'], ['사유 : ' + user.opts.afkreason]))
    user.opts.isafk = false
    user.opts.afkreason = ''
    DB.update('users', ['sid', 'id'], [msg.guild.id, msg.author.id], ['opts'], [JSON.stringify(user.opts)])
  }
  return user
}

//GET-SERVER-INFO
function guild (msg) {
  let server = DB.find('servers', ['id'], [msg.guild.id])[0]
  if (!server) {
    server = { id: msg.guild.id, opts: { adv: [], warn: 0 } }
    DB.insert('servers', ['id', 'opts'], [server.id, JSON.stringify(server.opts)])
  } else server.opts = JSON.parse(server.opts)
  return server
}

function load () {
  res = []
  fs.readdir(path.join(__dirname, '/lib/cmds'), (err, files) => {
    if (!err) {
      files.forEach(item => {
        if (item.endsWith('.js')) {
          delete require.cache[path.resolve('./lib/cmds/' + item)]
          res.push(require(path.join(__dirname, '/lib/cmds/', item)))
          console.log('I FIND ' + item)
        } else console.log('I IGNORE ' + item)
      })  
    } else console.log(err.toString())
  })
  return res
}

//BOT-LOGIN
bot.login(OPTION.token)
