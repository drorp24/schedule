const recommendationFields = ({
  id,
  estimated_start_activity,
  estimated_end_activity,
  start_date,
  platform_id,
  volleys,
}) => ({
  id,
  estimated_start_activity,
  estimated_end_activity,
  start_date,
  platform_id,
  fulfills: JSON.parse(volleys).map(({ delivery_request_id, option_id }) => ({
    delivery_request_id,
    option_id,
  })),
})

export default recommendationFields
