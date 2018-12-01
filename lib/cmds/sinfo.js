const embed = require('./../modules/embed');

exports.run = (msg, args, bot, Discord, DB) => {
  embed.init(bot);
  var a = msg.guild;
  msg.channel.send(embed.embed([
    '서버 이름',
    '서버 아이디',
    '서버 생성일',
    '서버 위치',
    '서버 인원',
    '서버 오너'
  ], [
    a.name,
    a.id,
    new Date(a.members.get(a.ownerID).joinedTimestamp),
    a.region,
    a.memberCount,
    '<@' + a.ownerID + '>'
  ]))
}

exports.info = {
  cmd: 'sinfo',
  description: '이 서버의 정보를 표시합니다.',
  example: 'sinfo',
  type: '기본'
}
