const merge = require('./../modules/merge_args')
const embed = require('./../modules/embed')
const keys = require('./../../keys.json')

const Youtube = require('youtube-node')
const youtube = new Youtube()

youtube.setKey(keys.youtube)
youtube.addParam('order', 'rating')
youtube.addParam('type', 'video')

exports.run = (msg, args, bot, Discord, DB) => {
  if (!args[1]) return msg.channel.send(embed.embed(['오류'], ['title을 입력해주세요']))

  let pl = DB.find('playlist', ['title', 'aid'], [args[1], msg.author.id])
  if (!pl || !pl[0]) {
    pl = { sid: msg.guild.id, aid: msg.author.id, opts: { list: [] } }
    DB.insert('playlist', ['title', 'sid', 'aid', 'opts'], [args[1], msg.guild.id, msg.author.id, JSON.stringify(pl.opts)])
  } else {
    pl = pl[0]
    pl.opts = JSON.parse(pl.opts)
  }
  
  switch (args[2]) {
    case 'add':
    console.log(merge.run(args, 3));
    
      youtube.search(merge.run(args, 3), 5, (err, res) => {
        console.log(err);
        
        if (err) return msg.channel.send(embed.embed(['오류'], ['유튜브에서 영상을 찾는데 실패했습니다\n' + err.toString()]))
        let item = res.items[0]
        let title = item.snippet.title
        let url = 'https://www.youtube.com/watch?v=' + item.id.videoId
        pl.opts.list.push({ title: title, url: url })
        msg.channel.send(embed.embed(['재생목록에 추가됨'], ['**대상**\n' + args[1] + '\n**곡 정보**\n제목 : ' + title + '\n링크 : ' + url]))
        DB.update('playlist', ['title', 'aid', 'sid'], [args[1], msg.author.id, msg.guild.id], ['opts'], [JSON.stringify(pl.opts)])
      })
      break
    case 'del':
      let index = Number(args[3])
      if (index < 0) return msg.channel.send(embed.embed(['오류'], ['uint로 변환할 수 없습니다']))
      if (pl.opts.list[index]) {
        msg.channel.send(embed.embed(['재생목록에 삭제됨'], ['**대상**\n' + args[1] + '\n**곡 정보**\n제목 : ' + pl.opts.list[index].title + '\n링크 : ' + pl.opts.list[index].url]))
        pl.opts.list.splice(index, 1)
        DB.update('playlist', ['title', 'aid', 'sid'], [args[1], msg.author.id, msg.guild.id], ['opts'], [JSON.stringify(pl.opts)])
      } else msg.channel.send(embed.embed(['오류'], ['해당 index를 찾을 수 없습니다']))
      break
    case 'list':
      let res = '<@' + pl.aid + '> 님의 재생목록\n**' + args[1] + '**\n'
      for (let i = 0; i < pl.opts.list.length; i++) {
        res += '**' + i + '.** ' + pl.opts.list[i].title + '\n'
      }
      msg.channel.send(res)
      break
    default:
      msg.channel.send(embed.embed(['오류'], ['명령어를 잘못 입력하신 것 같네요\n혹시 title에 띄어쓰기가 있지 않나요?']))
  }
}

exports.info = {
  cmd: 'pl',
  description: '나만의 재생목록!',
  example: 'pl [title] [add|del] [query|index]',
  type: '기본'
}
