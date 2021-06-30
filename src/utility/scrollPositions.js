const epsilon = 2

export const atScrollBottom = ({ offsetHeight, scrollTop, scrollHeight }) => {
  console.log(
    'offsetHeight, scrollTop, scrollHeight: ',
    offsetHeight,
    scrollTop,
    scrollHeight
  )
  console.log(
    'offsetHeight + scrollTop >= scrollHeight - epsilon: ',
    offsetHeight + scrollTop >= scrollHeight - epsilon
  )
  return offsetHeight + scrollTop >= scrollHeight - epsilon
}

export const atScrollTop = ({ scrollTop }) => scrollTop < epsilon
