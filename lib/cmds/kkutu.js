//  https://codeburst.io/an-introduction-to-web-scraping-with-node-js-1045b55c63f7
const rp = require('request-promise')
const cheerio = require('cheerio')
const embed = require('./../modules/embed')
const merge = require('./../modules/merge_args')

let _a = ['name', 'uri', 'date']

exports.run = (msg, args, bot, Discord, DB) => {
  embed.init(bot)
  let result
  let res = []
  let options = { uri: `http://jjo.kr/kkutu` }
  rp(options).then(($) => {
    $ = cheerio.load($)
    $('.available .t-head .ellipsis').each((i, elem) => {
      if (i % 3 === 0) res.push({ 'name': '', 'uri': '', 'date': '' })
      res[res.length - 1][_a[i % 3]] = $(elem).text()
    })

    if (!args[1]) {
      for (let item of res) {
        if (msg.guild.id === '353421713028939779') {
          console.log(item.name)
          if (item.name !== '냉이 끄투' && item.name !== '달력' && item.name !== 'Prj_KT') result = embed.addfield({ name: item.name, value: item.uri + ' | ' + item.date.replace(' 등록', '') })
        } else result = embed.addfield({ name: item.name, value: item.uri + ' | ' + item.date.replace(' 등록', '') })
      }
      msg.channel.send(result)
    } else {
      let serv = merge.run(args)
      serv = serv.substring(0, serv.length - 1)
      options.uri = find(res, 'name', serv)
      if (options.uri) {
        options.uri = options.uri.uri + '/servers'
        rp(options).then(($$) => {
          $$ = JSON.parse($$)
          for (let i in $$.list) result = embed.addfield({ name: serv + ' ' + i + ' 채널', value: $$.list[i] == null ? '채널이 닫혀있습니다.' : $$.list[i] + '명' })
          msg.channel.send(result)
        })
      } else {
        result = embed.addfield({ name: '경고', value: '서버가 오프라인이거나 존재하지 않을 수 있습니다.' })
      }
    }
  }).catch((err) => { console.log(err) })
  function find (a, b, c) {
    for (let item of a) if (item[b] === c) return item
  }
}

exports.info = {
  cmd: 'kkutu',
  description: '끄투 서버 정보를 알아냅니다.',
  example: 'kkutu [name|null]',
  type: '게임'
}
