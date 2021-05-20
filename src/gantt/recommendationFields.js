import { v4 as uuidv4 } from 'uuid'
import color from '../styling/color'
import pickNext from '../utility/pickNext'

const recommendationFields = ({
  id,
  estimated_start_activity,
  estimated_end_activity,
  start_date,
  platform_id,
  drone_formation,
  drone_package_config_id,
  volleys,
}) => ({
  id,
  estimated_start_activity,
  estimated_end_activity,
  start_date,
  platform_id,
  drone_formation,
  drone_package_config_id,
  fulfills: JSON.parse(volleys).map(({ delivery_request_id, option_id }) => ({
    delivery_request_id,
    option_id,
  })),
  employs: {
    platform_id,
    drone_package_config_id,
  },
  // ToDo: fake data; replace with new Api
  formation_id: uuidv4(),
  color: pickNext(color),
})

export default recommendationFields
