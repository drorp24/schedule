const objectify = (array, key = 'id') =>
  array.reduce(
    (obj, item) => ({
      ...obj,
      [item[key]]: item,
    }),
    {}
  )

export default objectify
