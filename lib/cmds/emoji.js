exports.run = (msg, args, bot, Discord, DB) => {
  let emojis = []
  for (let i = 1; i < args.length; i++) {
    if (args[i]) {
      let emoji = bot.emojis.find(e => e.name === args[i])
      if (emoji) emojis.push(emoji)
    }
  }
  if (emojis) msg.channel.send(emojis.join(' '))
}

exports.info = {
  cmd: 'emoji',
  description: '이모지!',
  example: 'emoji [name]',
  type: '기본'
}
