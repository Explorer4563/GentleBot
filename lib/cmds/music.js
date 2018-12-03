const merge = require('./../modules/merge_args')
const embed = require('./../modules/embed')
const keys = require('./../../keys.json')

const fs = require('fs')
const ytdl = require('ytdl-core')
const Youtube = require('youtube-node')
const youtube = new Youtube()

youtube.setKey(keys.youtube)
youtube.addParam('order', 'rating')
youtube.addParam('type', 'video')

let plays = {}

exports.run = (msg, args, bot, Discord, DB) => {
  embed.init(bot)
  let pl = plays[msg.guild.id] || { playlist: [], volume: 0.5, autoStart: true, conn: null, now: { title: 'UNKNOWN', url: 'UNKNOWN' }, connw: null }
  try {
  switch (args[1]) {
    case 'join':
      if (!pl.conn) {
        vc('join').then((conn) => {
          pl.conn = conn
          if (pl.autoStart && pl.playlist[0]) run()
        })
      }
      break
    case 'pl':
      let query = args[2]
      let list = DB.find('playlist', ['title', 'aid'], [query, msg.author.id])
      if (!list || !list[0]) return msg.channel.send(embed.embed(['오류'], ['해당 재생목록을 찾을 수 없습니다']))
      list = JSON.parse(list[0].opts).list
      let res = list.length + '개의 음악을 "' + query + '"에서 불러왔습니다\n'
      list.forEach(item => {
        pl.playlist.push(item)
        res += '**-** ' + item.title + '\n'
      })
      msg.channel.send(res)

      if (pl.autoStart) {
        pl.autoStart = false
        run()
      }
      break
    case 'play':
      if (!pl || !pl.conn) return msg.channel.send(embed.embed(['오류'], ['먼저 m join 명령어를 사용해주세요!']))
      youtube.search(merge.run(args, 2, args.length, true), 5, (err, res) => {
        if (!err) {
          let item = res.items[0]
          let title = item.snippet.title
          let url = 'https://www.youtube.com/watch?v=' + item.id.videoId
          pl.playlist.push({ title: title, url: url })
          msg.channel.send(embed.embed(['대기열 등록됨'], [title + '\n' + url]))
          if (pl.autoStart) {
            pl.autoStart = false
            run()
          }
        }
      })
      break
    case 'stop':
      if (pl) {
        pl.skip = true
        vc('leave')
        pl.conn = null
        pl.autoStart = true
      } else msg.channel.send(embed.embed(['오류'], ['먼저 m join 명령어를 사용해주세요!']))
      break
    case 'start':
      if (pl.playlist && pl.playlist.length > 0) {
        if (pl.connw) return msg.channel.send(embed.embed(['오류'], ['m skip 명령어를 사용해주세요!']))
        if (pl.conn) run()
        else msg.channel.send(embed.embed(['오류'], ['먼저 m join 명령어를 사용해주세요!']))
      } else msg.channel.send(embed.embed(['오류'], ['대기열에 아무런 음악이 없네요!']))
      break
    case 'queue':
      let ress = '\nNOW : **' + pl.now.title + '** \n'
      if ((pl.playlist && pl.playlist.length > 0) || pl.now) {
        pl.playlist.forEach((item) => {
          ress += '**-** ' + item.title + '\n'
        })
      } else ress = '대기열에 등록된 음악이 없습니다.'
      msg.channel.send(embed.embed(['대기열'], [ress]))
      break
    case 'skip':
      if (pl || pl.playlist.length === 0 && pl.title === 'UNKNOWN') {
        pl.skip = true
        run()
      } else msg.channel.send(embed.embed(['대기열'], ['대기열에 등록된 음악이 없습니다.']))
      break
    case 'volume':
      let temp = Number(args[2])
      if (pl) {
        if (temp >= 0) {
          if (temp <= 200) {
            pl.volume = temp / 100
            if (pl.connw) pl.connw.setVolumeLogarithmic(pl.volume)
            msg.channel.send(embed.embed(['볼륨 변경됨'], ['볼륨이 ' + temp + '% 로 변경되었습니다.']))
          }
          else msg.channel.send(embed.embed(['오류'], ['값은 0 ~ 200 사이여야 합니다.']))
        } else msg.channel.send(embed.embed(['오류'], ['int로 변환할 수 없습니다.']))
      } else msg.channel.send(embed.embed(['오류'], ['먼저 m join 명령어를 사용해주세요!']))
      break
    case 'repeat':
      if (pl) {
        if (!pl.repeat) {
          if (!pl.shuffle) {
            pl.repeat = true
            msg.channel.send(embed.embed(['옵션 변경'], ['반복 재생 옵션이 켜졌습니다']))
          } else msg.channel.send(embed.embed(['오류'], ['랜덤 재생 옵션과 반복 재생 옵션은 같이 사용될 수 없습니다']))
        } else {
          pl.repeat = false
          msg.channel.send(embed.embed(['옵션 변경'], ['반복 재생 옵션이 꺼졌습니다']))
        }
      } else msg.channel.send(embed.embed(['오류'], ['먼저 m join 명령어를 사용해주세요!']))
      break
    case 'shuffle':
      if (pl) {
        if (!pl.shuffle) {
          if (!pl.repeat) {
            pl.shuffle = true
            msg.channel.send(embed.embed(['옵션 변경'], ['랜덤 재생 옵션이 켜졌습니다']))
          } else msg.channel.send(embed.embed(['오류'], ['랜덤 재생 옵션과 반복 재생 옵션은 같이 사용될 수 없습니다']))
        } else {
          pl.shuffle = false
          msg.channel.send(embed.embed(['옵션 변경'], ['랜덤 재생 옵션이 꺼졌습니다']))
        }
      } else msg.channel.send(embed.embed(['오류'], ['먼저 m join 명령어를 사용해주세요!']))
      break
    case 'clear':      
      if (pl) {
        pl.playlist = []
        pl.connw.end()
        pl.autoStart = true
        delete pl.connnw
      }
      break
    case 'info':
      if (pl) msg.channel.send(embed.embed(['반복 재생 옵션', '랜덤 재생 옵션'], [pl.repeat ? 'on' : 'off', pl.shuffle ? 'on' : 'off']))
      else msg.channel.send(embed.embed(['오류'], ['먼저 m join 명령어를 사용해주세요!']))
      break
    case 'help':
    default:
      msg.channel.send(embed.embed(['m join', 'm play [검색어]', 'm skip', 'm volume [1 ~ 200]', 'm stop', 'm repeat', 'm shuffle', 'm pl [재생목록명]'],
      ['음성 채팅방에 연결합니다', '유튜브에서 검색하여 찾아낸 자료를 대기열에 추가합니다', '지금 재생중인 것을 넘깁니다', '볼륨을 조절합니다.',
      '음성 채팅방에 나갑니다', '(토글) 반복 재생 옵션을 끄고 킵니다', '(토글) 랜덤 재생 옵션 기능을 끄고 킵니다', '해당 재생목록을 대기열에 추가합니다']))
      break
  }
  plays[msg.guild.id] = pl

  function vc (a) {
    let vc = msg.member.voiceChannel
    if (vc && a) return vc[a]()
    else msg.channel.send(embed.embed(['오류'], ['당신은 음성채팅 채널에 없네요!']))
  }

  function run () {
    let _pl = plays[msg.guild.id]
    let i = _pl.shuffle ? Math.floor(Math.random() * _pl.playlist.length) : 0
    if (_pl.playlist[i]) {
      let now = _pl.playlist[i]
      ytdl.getInfo(now.url, (err, inf) => {
        if (err) {
          msg.channel.send(embed.embed(['오류'], ['재생 도중 알 수 없는 오류가 발생하여 해당 음악을 스킵합니다']))
          return run()
        }
        
        plays[msg.guild.id].now = now
        plays[msg.guild.id].playlist.splice(i, 1)
        msg.channel.send(embed.embed(['지금 스트리밍 중'], [now.title + '\n' + now.url]))
        if (_pl.conn) {
          plays[msg.guild.id].connw = _pl.conn.playStream(ytdl(now.url, { quality: 'highest', filter: 'audioonly' })).on('end', async () => {
            plays[msg.guild.id].title = 'UNKNOWN'
            if (_pl.repeat) plays[msg.guild.id].playlist.push(now)
            if (!plays[msg.guild.id].skip) run()
            else plays[msg.guild.id].skip = false
          })
          plays[msg.guild.id].connw.setVolumeLogarithmic(_pl.volume)
        }
      })
    } else {
      plays[msg.guild.id].autoStart = true
      return
    }
  }
  } catch (e) {
    console.log(e)
  }
}

exports.info = {
  cmd: 'm',
  description: '음악은 유일하게 국가에서 허용한 마약이다\n(커맨드가 많아서 m help로 확인하세요)',
  example: 'm [help]',
  type: '기타'
}
