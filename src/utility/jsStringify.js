// Stringify an object
const jsStringify = o =>
  JSON.stringify(o).replace(/"/g, ' ').replace(/ :/g, ': ')

export default jsStringify
