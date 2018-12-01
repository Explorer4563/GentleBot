//이건 메시지 보낸사람의 아이디만 알아도
//admins.indexOf(id) 으로 찾아낼 수 있기 때문에 굳이 msg를 보낼 필요가 없다.
const admins = require('./../../bot.json').admins
exports.run = (id) => {
  var res = false
  if (admins.indexOf(id) >= 0) res = true
  return res
}
