const merge = require('./../modules/merge_args')
const embed = require('./../modules/embed')
const keys = require('../../keys.json')

exports.run = (msg, args, bot, Discord, DB) => {
  embed.init(bot)
  let type = args[1]
  if (!keys.papago[args[1]]) return msg.channel.send(embed.embed(['오류'], ['client_id를 불러올 수 없습니다']))
  let client_id = keys.papago[args[1]].id
  let client_secret = keys.papago[args[1]].secret
  let api_url = keys.papago[args[1]].url
  console.log(args);

  args.splice(1, 1)
  
  let query = type === 'auto' ? merge.run(args, 1) : merge.run(args, 3, args.length - 3)
  if (query){
    let request = require('request')
    let options = {
      url: api_url,
      form: {'text': query, 'query': query},
      headers: {'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret}
    }

    if (type !== 'auto') {
      options.form.source = args[1]
      options.form.target = args[2]
    }
    
    request.post(options, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        body = JSON.parse(body)
        
        if (type === 'auto') {
          args[1] = 'nmt'
          args[2] = body.langCode
          args[3] = 'ko'
          args[4] = query
          return this.run(msg, args, bot, Discord, DB)
        }

        var result = embed.embed(['번역 전 (' + args[1] + ')', '번역 후 (' + args[2] + ')'], [query, body.message.result.translatedText])
        msg.channel.send(result)
      } else {
        console.log('error = ' + response.statusCode)
      }
    })
  }
}

exports.info = {
  cmd: 'pa',
  description: '파파고 등장!',
  example: 'pa [smt|nmt|auto] [언어코드] [언어코드] [번역할 내용]',
  type: '기타'
}
