exports.run = (str, item, changestr) => {
  while(item.indexOf(str) > -1){
    item = item.replace(str, changestr);
  }
  return item;
}
