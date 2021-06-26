export const union = (a, b) => [...new Set([...a, ...b])]

export const intersection = (a, b) => [
  ...new Set([...a].filter(x => new Set(b).has(x))),
]

export const difference = (a, b) => [
  ...new Set([...a].filter(x => !new Set(b).has(x))),
]
