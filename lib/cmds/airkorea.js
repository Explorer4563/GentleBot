const rp = require('request-promise')
const embed = require('./../modules/embed')
const merge = require('./../modules/merge_args')
const keys = require('./../../keys.json')
const urlencode = require('urlencode')

const list = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주', '세종']
const url = 'http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getCtprvnMesureSidoLIst?ServiceKey=' + keys.airKorea + '&searchCondition=HOUR&_returnType=json&numOfRows=100&pageNo=1&sidoName='

exports.run = (msg, args, bot, Discord, DB) => {
  let titles = []
  let values = []
  embed.init(bot)
  list.forEach(item => {
    let options = { uri: url + urlencode(item) }
    if (!args[1] || args[1] === item) rp(options).then((res) => {
      res = JSON.parse(res)
      let pm10 = Number(res.list[0].pm10Value)
      let pm25 = Number(res.list[0].pm25Value)
      titles.push(item)
      
      let pm10v = ''
      if (pm10 <= 30) pm10v += '좋음'
      else if (pm10 <= 80) pm10v += '보통'
      else if (pm10 <= 120) pm10v += '약간 나쁨'
      else pm10v += '나쁨'
      pm10v += ' (' + pm10 + '㎍/m³)'

      let pm25v = ''
      if (pm25 <= 15) pm25v += '좋음'
      else if (pm25 <= 50) pm25v += '보통'
      else if (pm25 <= 100) pm25v += '나쁨'
      else pm25v += '매우 나쁨'
      pm25v += ' (' + pm25 + '㎍/m³)'
      values.push('미세먼지 : ' + pm10v + '\n' + '초미세먼지 : ' + pm25v)
    }).then(() => {
      if (args[1] && values.length === 0) return
      else if (!args[1] && values.length !== list.length) return
      else msg.channel.send(embed.embed(titles, values))
    }).catch((e) => { msg.channel.send(embed.embed(['오류'], [e.toString()])) })
  })
}

exports.info = {
  cmd: 'airkorea',
  description: '미세먼지 정보를 찾아옵니다',
  example: 'airkorea [sidoname]',
  type: '기타'
}
