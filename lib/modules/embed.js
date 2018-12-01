var result

exports.init = (bot) => {
  result = { embed:  {
      color: 3447003,
      author: {
        name: bot.user.username,
        icon_url: bot.user.avatarURL
      },
      fields: [],
      timestamp: new Date(),
      footer: {
        text: "GentleBot V3.0.0"
      }
    }
  }
}

exports.embed = (title, value, color) => {
  var field = []
  if(title && value) for(i = 0; i < title.length; i++) field[i] = { name: title[i], value: value[i] }
  result.embed.fields = field
  if(color) result.embed.color = color
  return result
}

exports.addfield = (field) => {
  result.embed.fields.push(field)
  return result
}
