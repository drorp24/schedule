import pick from 'lodash.pick'

const excludeKeys = ({ obj, exclude }) => {
  if (!exclude) return obj
  return pick(
    obj,
    Object.keys(obj).filter(k => !exclude.includes(k))
  )
}

export default excludeKeys
