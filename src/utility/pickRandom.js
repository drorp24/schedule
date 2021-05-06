const pickRandom = a => {
  if (!Array.isArray(a) || !a.length) return null

  const divisor = 1 / a.length
  const rand = Math.random()
  const pick = Math.trunc(rand / divisor)
  return a[pick]
}

export default pickRandom
