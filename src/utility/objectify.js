let objectify = (array, key) =>
  array.reduce(
    (obj, item) => ({
      ...obj,
      ...(key && { [item[key]]: item }),
      ...(!key && { [item]: true }),
    }),
    {}
  )

export default objectify
