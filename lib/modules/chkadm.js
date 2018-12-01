//msg를 받는 이유중 하나는
//msg에는 멤버라는 속성이 존재하여, 이 멤버가 type라는 권한을 가졌는지 체크 한 후
//존재하면 반환한다.
exports.run = (msg, type) => {
  let res = false
  if (msg.member.hasPermission(type)) res = true
  return res
}
