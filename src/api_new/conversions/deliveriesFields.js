import color from '../../styling/color'
import pickNext from '../../utility/pickNext'

const deliveriesFields = ({ delivering_drones_id, ...rest }) => ({
  id: delivering_drones_id,
  ...rest,
  color: pickNext(color),
})

export default deliveriesFields
