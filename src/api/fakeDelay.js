const fakeDelay = (file, delay = 500) =>
  new Promise(resolve => {
    setTimeout(() => resolve(file), delay)
  })

export default fakeDelay
