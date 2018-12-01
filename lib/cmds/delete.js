const embed = require('./../modules/embed')
const ymdate = require('yyyy-mm-dd')
const chkadm = require('./../modules/chkadm')
const chkown = require('./../modules/chkown')

//(msg, args, bot, Discord);
exports.run = async (msg, args, bot, Discord, DB) => {
  embed.init(bot)
  if(chkadm.run(msg, 'ADMINISTRATOR') || chkown.run(msg.author.id)){
    let limit = Number(args[1])
    const fetched = await msg.channel.fetchMessages({ limit: limit })
    const fetcharray = fetched.array()
    msg.channel.bulkDelete(fetcharray).then(__ => {
      for(i = 0; i < fetcharray.length; i++){
        let temp = { authorid:fetcharray[i].author.id, content:fetcharray[i].content, deletedtime: ymdate.withTime() };
      }
      msg.channel.send(embed.embed([fetched.size + '개의 메시지 발견'], ['삭제된 메시지는 **!restore**로 복원이 가능합니다.'])).then(e => {
        e.delete(1000)
      })
    }).catch(e => {
      msg.channel.send(embed.embed(['오류'], [e.toString()])).then(_msg => {
        _msg.delete(5000)
      })
    })
  } else msg.channel.send(embed.embed(['오류'], ['관리자가 아닙니다.']))
}

exports.info = {
  cmd: 'delete',
  description: '메시지 삭제',
  example: 'delete [삭제할 메시지 수량]',
  type: '관리자'
}
