exports.run = (args, start, length, a) => {
  var result = []
  if (!start) start = 1
  if (!length) length = args.length
  for (let i = start; i < (a ? length : start + length); i++) result.push(args[i])
  return result.join(' ')
}
