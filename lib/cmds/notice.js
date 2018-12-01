const merge = require('./../modules/merge_args')
const embed = require('./../modules/embed')
const chkown = require('./../modules/chkown')
const chkadm = require('./../modules/chkadm')
let a = [ 'bot', 'announce', 'notice', '봇', '공지' ]

exports.run = (msg, args, bot, Discord, DB) => {
  embed.init(bot)
  let notice = merge.run(args)
  if(chkown.run(msg.author.id)){
    bot.guilds.map((guild) => {
      this.notice(guild, notice)
    });
  } else if (chkadm.run(msg, 'ADMINISTRATOR')) {
    this.notice(msg.guild, notice)
  } else {
    msg.channel.send(embed.embed(['오류'], ['권한이 없습니다.']))
  }
}

exports.info = {
  cmd: 'notice',
  description: '봇 제작자는 모든 서버에 공지를 하고\n서버 관리자는 해당 서버에만 공지하는 기능입니다.',
  example: 'notice [내용]',
  type: '관리자'
}

exports.notice = (guild, str) => {
  let first, second, isbreak
  for (sec of a) {
    for (fir of a) {
      first = guild.channels.find('name', sec + '-' + fir)
      if(first && first.type == 'text') first.send(str), isbreak = true
      if(isbreak) return
    }
  }
}
