let pick = 0

const pickNext = a => a[pick++ % a.length]

export default pickNext
